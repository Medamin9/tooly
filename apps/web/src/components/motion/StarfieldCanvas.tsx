'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
import { useTheme } from '../theme/ThemeProvider';

function hexToVec3(hex: string): THREE.Vector3 {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255
  );
}

const LAYERS = {
  NONE: 0,
  TORUS_SCENE: 1,
  BLOOM_SCENE: 2,
  ENTIRE_SCENE: 3,
};

// Fixed configuration parameters tuned for Tooly's aesthetic and responsive interaction
const BASE_CONFIG = {
  opacity: 0.5,
  pointSize: 30,
  brightness: 1.85,
  drift: 2.35, // steady tunnel speed
  twinkle: 1,
  spin: 0.03, // barrel rotation rate
  repelRadius: 5,
  repelStrength: 0.35,
  scrollPush: 8, // forward camera dive on scroll
  scrollDrift: 6, // extra drift surge on scroll
  scrollSpin: 0.1, // extra spin on scroll
  parallax: 0.6, // cursor camera offset
};

// Tooly Brand Palettes: Dark Cosmic Starlight vs Warm Crystalline Paper Starlight
const DARK_PALETTE = {
  flameA: hexToVec3('#F52F3D'), // Tooly primary red flame
  flameB: hexToVec3('#5EEAD4'), // Mint/cyan complementary flame
  flameAmt: 0.2,
  colorA: hexToVec3('#AEF6CF'), // Mint starlight
  colorB: hexToVec3('#FF4D5A'), // Tooly vibrant red starlight
  colorC: hexToVec3('#FFF4EA'), // Warm bone starlight
};

const LIGHT_PALETTE = {
  flameA: hexToVec3('#FED7AA'), // Soft peach/amber flame
  flameB: hexToVec3('#FECDD3'), // Soft rose flame
  flameAmt: 0.12,
  colorA: hexToVec3('#0D9488'), // Teal starlight
  colorB: hexToVec3('#F52F3D'), // Tooly red starlight
  colorC: hexToVec3('#374151'), // Deep slate starlight
};

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);

  useEffect(() => {
    themeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return;

    // Check reduced motion preference
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const config = {
      ...BASE_CONFIG,
      drift: reduceMotion ? 0.6 : BASE_CONFIG.drift,
      spin: reduceMotion ? 0.005 : BASE_CONFIG.spin,
      scrollDrift: reduceMotion ? 1 : BASE_CONFIG.scrollDrift,
      scrollSpin: reduceMotion ? 0.02 : BASE_CONFIG.scrollSpin,
    };

    // 1. Scene, Camera, Renderer (with transparent background)
    const scene = new THREE.Scene();
    scene.background = null;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 80);
    camera.position.set(0, 0, 5);
    camera.layers.enable(LAYERS.TORUS_SCENE);
    camera.layers.enable(LAYERS.BLOOM_SCENE);
    camera.layers.enable(LAYERS.ENTIRE_SCENE);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;

    // 2. Geometry: 4200 stars volume
    const count = 4200;
    const depth = 30;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const palette = new Float32Array(count);
    const bright = new Float32Array(count);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 24; // x: box width 24
      positions[i3 + 1] = (Math.random() - 0.5) * 16; // y: box height 16
      positions[i3 + 2] = (Math.random() - 0.5) * 30; // z: box depth 30
      palette[i] = Math.floor(Math.random() * 3);
      bright[i] = 0.7 + Math.random() * 0.6;
      scales[i] = 0.5 + Math.pow(Math.random(), 1.4) * 2.5;
      phases[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.Float32BufferAttribute(scales, 1));
    geometry.setAttribute('aPhase', new THREE.Float32BufferAttribute(phases, 1));
    geometry.setAttribute('aPalette', new THREE.Float32BufferAttribute(palette, 1));
    geometry.setAttribute('aBright', new THREE.Float32BufferAttribute(bright, 1));

    // Dynamic color values that smoothly interpolate on theme toggle
    const initialPalette = themeRef.current === 'dark' ? DARK_PALETTE : LIGHT_PALETTE;
    const curFlameA = initialPalette.flameA.clone();
    const curFlameB = initialPalette.flameB.clone();
    let curFlameAmt = initialPalette.flameAmt;
    const curColorA = initialPalette.colorA.clone();
    const curColorB = initialPalette.colorB.clone();
    const curColorC = initialPalette.colorC.clone();

    // 3. Points ShaderMaterial
    const pointsMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: config.pointSize },
        uOpacity: { value: 0 },
        uDrift: { value: 0 },
        uDepth: { value: depth },
        uTwinkle: { value: config.twinkle },
        uCursor: { value: new THREE.Vector3() },
        uRepelRadius: { value: config.repelRadius },
        uRepelStrength: { value: config.repelStrength },
        uActivity: { value: 0 },
        uColorA: { value: curColorA },
        uColorB: { value: curColorB },
        uColorC: { value: curColorC },
        uBrightness: { value: config.brightness },
      },
      vertexShader: `
        uniform float uTime; uniform float uSize; uniform float uDrift; uniform float uDepth; uniform float uTwinkle;
        uniform vec3 uCursor; uniform float uRepelRadius; uniform float uRepelStrength; uniform float uActivity;
        uniform vec3 uColorA; uniform vec3 uColorB; uniform vec3 uColorC;
        attribute float aScale; attribute float aPhase; attribute float aPalette; attribute float aBright;
        varying vec3 vColor; varying float vTwinkle;
        void main() {
          vec3 pos = position;
          // Endless drift toward +Z with mod-wrap.
          pos.z = mod(pos.z + uDrift + (uDepth * 0.5), uDepth) - (uDepth * 0.5);

          float tw = sin(uTime * 1.6 + aPhase * 6.2831);
          vTwinkle = (1.0 - uTwinkle) + uTwinkle * (0.55 + 0.45 * tw);

          vec4 modelPosition = modelMatrix * vec4(pos, 1.0);

          vec3 toParticle = modelPosition.xyz - uCursor;
          float dist = length(toParticle);
          float falloff = smoothstep(uRepelRadius, 0.0, dist);
          modelPosition.xyz += normalize(toParticle + vec3(0.0001)) * falloff * uRepelStrength * uActivity;

          vec4 viewPosition = viewMatrix * modelPosition;
          gl_Position = projectionMatrix * viewPosition;
          gl_PointSize = uSize * aScale;
          gl_PointSize *= (1.0 / -viewPosition.z);

          vec3 base = aPalette < 0.5 ? uColorA : (aPalette < 1.5 ? uColorB : uColorC);
          vColor = base * aBright;
        }
      `,
      fragmentShader: `
        uniform float uOpacity; uniform float uBrightness;
        varying vec3 vColor; varying float vTwinkle;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float strength = pow(1.0 - d * 2.0, 4.0);
          vec3 color = mix(vec3(0.0), vColor, strength);
          gl_FragColor = vec4(color * uBrightness, strength * uOpacity * vTwinkle);
        }
      `,
    });

    const points = new THREE.Points(geometry, pointsMaterial);
    points.layers.enable(LAYERS.ENTIRE_SCENE);
    points.layers.enable(LAYERS.BLOOM_SCENE);
    points.layers.enable(LAYERS.TORUS_SCENE);

    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    // 4. Atmosphere FinalPass & Postprocessing Composers
    const emptyTexture = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
    emptyTexture.needsUpdate = true;

    const FinalShader = {
      uniforms: {
        iTime: { value: 0 },
        tDiffuse: { value: null },
        torusTexture: { value: null },
        bloomTexture: { value: null },
        haloTexture: { value: emptyTexture },
        uFlameA: { value: curFlameA },
        uFlameB: { value: curFlameB },
        uFlameAmt: { value: curFlameAmt },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime; uniform sampler2D tDiffuse; uniform sampler2D bloomTexture; uniform sampler2D torusTexture; uniform sampler2D haloTexture;
        uniform vec3 uFlameA; uniform vec3 uFlameB; uniform float uFlameAmt;
        varying vec2 vUv;
        vec3 warp3d(vec3 pos, float t){ float curv=.8,a=1.9,b=0.7; pos*=2.;
          pos.x+=curv*sin(t+a*pos.y)+t*b; pos.y+=curv*cos(t+a*pos.x);
          pos.z+=curv*sin(t+a*pos.z)+t*b; pos.z+=curv*cos(t+a*pos.y);
          pos.x+=curv*sin(t+a*pos.x)+t*b; pos.x+=curv*cos(t+a*pos.z);
          return 0.5+0.5*cos(pos.xyz+vec3(1,2,4)); }
        void main(){
          vec2 uv = 2.*vUv - 1.;
          vec3 w = pow(warp3d(vec3(uv.x, sin(uv.y), uv.y), iTime*1.5), vec3(1.5));
          vec3 flame = 1.5*uFlameA*w.x; flame*=w.y; flame += uFlameB*w.z;
          flame *= smoothstep(0.25, 1., abs(uv.y));
          float md = smoothstep(-0.7, 1., -uv.y*uv.x); flame *= md*md;
          vec3 halo = texture2D(haloTexture, vUv).xyz;
          vec3 stars = texture2D(bloomTexture, vUv).xyz + texture2D(torusTexture, vUv).xyz + texture2D(tDiffuse, vUv).xyz + halo;
          vec3 color = stars + flame * uFlameAmt;
          float alpha = clamp(max(color.r, max(color.g, color.b)) * 1.25, 0.0, 1.0);
          gl_FragColor = vec4(color, alpha);
        }
      `,
    };

    const renderScene = new RenderPass(scene, camera, null, null, 0);
    renderScene.clear = true;

    const torusComposer = new EffectComposer(renderer);
    torusComposer.renderToScreen = false;
    torusComposer.addPass(renderScene);
    torusComposer.addPass(new ShaderPass(GammaCorrectionShader));
    torusComposer.addPass(new UnrealBloomPass(new THREE.Vector2(width, height), 0.22, 0.2, 0));
    torusComposer.addPass(new ShaderPass(CopyShader));

    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(new UnrealBloomPass(new THREE.Vector2(width, height), 0.4, 0.55, 0));
    bloomComposer.addPass(new ShaderPass(GammaCorrectionShader));

    const finalPass = new ShaderPass(FinalShader);
    const finalComposer = new EffectComposer(renderer);
    finalComposer.addPass(renderScene);
    finalComposer.addPass(finalPass);

    finalPass.uniforms.bloomTexture.value = bloomComposer.renderTarget1.texture;
    finalPass.uniforms.torusTexture.value = torusComposer.renderTarget1.texture;

    // 5. Interaction State (Pointer & Double-Damped Scroll)
    let pointerActive = false;
    let lastMove = performance.now();
    const mouseNDC = { x: 0, y: 0 };
    const mouseSmooth = { x: 0, y: 0 };
    const pointerWorld = new THREE.Vector3();
    let pointerActivity = 0;

    let scrollTarget = 0;
    let scrollSmooth = 0;
    let scrollCurrent = 0;

    const onPointerMove = (e: PointerEvent) => {
      mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerActive = true;
      lastMove = performance.now();
    };

    const onPointerLeave = () => {
      pointerActive = false;
    };

    const computeScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollTarget = Math.min(1, Math.max(0, scrollY / maxScroll));
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('scroll', computeScroll, { passive: true });
    computeScroll();

    // 6. Animation Loop
    let animationFrameId: number;
    let t0 = performance.now() / 1000;
    const appearStart = performance.now();
    let uDrift = 0;

    const tick = () => {
      const now = performance.now();
      const t = now / 1000;
      const dt = Math.min(0.05, Math.max(0, t - t0));
      t0 = t;

      // Theme dynamic color lerp
      const targetPalette = themeRef.current === 'dark' ? DARK_PALETTE : LIGHT_PALETTE;
      curFlameA.lerp(targetPalette.flameA, 0.08);
      curFlameB.lerp(targetPalette.flameB, 0.08);
      curFlameAmt += (targetPalette.flameAmt - curFlameAmt) * 0.08;
      curColorA.lerp(targetPalette.colorA, 0.08);
      curColorB.lerp(targetPalette.colorB, 0.08);
      curColorC.lerp(targetPalette.colorC, 0.08);

      finalPass.uniforms.uFlameAmt.value = curFlameAmt;

      // Double-damped scroll and smoothed pointer
      scrollSmooth += (scrollTarget - scrollSmooth) * 0.1;
      scrollCurrent += (scrollSmooth - scrollCurrent) * 0.06;
      mouseSmooth.x += (mouseNDC.x - mouseSmooth.x) * 0.06;
      mouseSmooth.y += (mouseNDC.y - mouseSmooth.y) * 0.06;

      // World-space pointer unprojection & repulsion calculation
      const ndcVec = new THREE.Vector3(mouseNDC.x, mouseNDC.y, 0.5);
      ndcVec.unproject(camera);
      const dir = ndcVec.sub(camera.position).normalize();

      let targetX = 0;
      let targetY = 0;
      let targetZ = 0;

      if (pointerActive && Math.abs(dir.z) > 1e-4) {
        const rayT = -camera.position.z / dir.z;
        if (rayT > 0 && isFinite(rayT)) {
          targetX = camera.position.x + dir.x * rayT;
          targetY = camera.position.y + dir.y * rayT;
          targetZ = camera.position.z + dir.z * rayT;
        }
      }

      pointerWorld.x += (targetX - pointerWorld.x) * 0.12;
      pointerWorld.y += (targetY - pointerWorld.y) * 0.12;
      pointerWorld.z += (targetZ - pointerWorld.z) * 0.12;

      const idle = (now - lastMove) / 1000;
      const want = pointerActive && idle < 3 ? 1 : 0;
      pointerActivity += (want - pointerActivity) * 0.06;

      pointsMaterial.uniforms.uCursor.value.copy(pointerWorld);
      pointsMaterial.uniforms.uActivity.value = pointerActivity;

      // Starfield physics & camera dive
      pointsMaterial.uniforms.uTime.value = t;
      uDrift += dt * (config.drift + scrollCurrent * config.scrollDrift);
      pointsMaterial.uniforms.uDrift.value = uDrift;

      camera.position.set(
        mouseSmooth.x * config.parallax,
        mouseSmooth.y * config.parallax,
        5 - scrollCurrent * config.scrollPush
      );
      camera.lookAt(mouseSmooth.x * config.parallax, mouseSmooth.y * config.parallax, -10);

      // Smooth appear fade
      const elapsed = now - appearStart;
      const fade = Math.min(1, Math.max(0, (elapsed - 300) / 1400));
      pointsMaterial.uniforms.uOpacity.value = fade * config.opacity;

      group.rotation.z += dt * (config.spin + scrollCurrent * config.scrollSpin);

      // Render the three composers in order using layer masking
      finalPass.uniforms.iTime.value = t;

      camera.layers.set(LAYERS.TORUS_SCENE);
      torusComposer.render();

      camera.layers.set(LAYERS.BLOOM_SCENE);
      bloomComposer.render();

      finalPass.uniforms.torusTexture.value =
        torusComposer.readBuffer?.texture || torusComposer.renderTarget1.texture;
      finalPass.uniforms.bloomTexture.value =
        bloomComposer.readBuffer?.texture || bloomComposer.renderTarget1.texture;

      camera.layers.set(LAYERS.ENTIRE_SCENE);
      finalComposer.render();

      if (!isTabHidden) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    let isTabHidden = false;
    const onVisibility = () => {
      isTabHidden = typeof document !== 'undefined' ? document.hidden : false;
      if (!isTabHidden) {
        t0 = performance.now() / 1000;
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    animationFrameId = requestAnimationFrame(tick);

    // 7. Responsive Resize Handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const pr = Math.min(window.devicePixelRatio || 1, 1.5);

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setPixelRatio(pr);
      renderer.setSize(w, h);

      torusComposer.setPixelRatio(pr);
      torusComposer.setSize(w, h);

      bloomComposer.setPixelRatio(pr);
      bloomComposer.setSize(w, h);

      finalComposer.setPixelRatio(pr);
      finalComposer.setSize(w, h);

      computeScroll();
    };

    window.addEventListener('resize', handleResize);

    // 8. Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', computeScroll);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      pointsMaterial.dispose();
      emptyTexture.dispose();
      torusComposer.dispose();
      bloomComposer.dispose();
      finalComposer.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 block bg-transparent"
    />
  );
}
export default StarfieldCanvas;

