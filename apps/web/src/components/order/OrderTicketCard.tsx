'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Download,
  Scissors,
  Check,
  Copy,
  Clock,
  ShieldCheck,
  Building,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  QrCode,
  FileText,
  Send,
} from 'lucide-react';
import type { Locale } from '@tooly/contracts';
import { TearTicket } from '@/components/motion/TearTicket';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface OrderTicketData {
  id?: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt?: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  items?: Array<{
    id?: string;
    productTitle?: string;
    planDuration?: string;
    unitPrice: number;
    quantity: number;
  }>;
  fulfillment?: {
    status?: string;
    instructions?: string;
  };
}

interface OrderTicketCardProps {
  order: OrderTicketData;
  locale: Locale;
  defaultTorn?: boolean;
  onTear?: () => void;
  className?: string;
}

/**
 * Generates and downloads a branded standalone HTML receipt document
 * with Tooly verification stamp, payment RIB, and print layout.
 */
export function downloadOrderReceipt(order: OrderTicketData, locale: Locale) {
  const isAr = locale === 'ar';
  const isFr = locale === 'fr';

  const orderTitle = isAr
    ? 'وصل طلب اشتراك رقمي — Tooly.tn'
    : isFr
      ? 'Reçu de commande d’abonnement — Tooly.tn'
      : 'Digital Subscription Order Receipt — Tooly.tn';

  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleString(
        locale === 'ar' ? 'ar-TN' : locale === 'fr' ? 'fr-TN' : 'en-US'
      )
    : new Date().toLocaleDateString();

  const primaryItem = order.items?.[0];
  const itemTitle = primaryItem?.productTitle || 'Abonnement Digital Pro';
  const itemDuration = primaryItem?.planDuration || '1 mois';

  const htmlContent = `<!DOCTYPE html>
<html lang="${locale}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8" />
  <title>${order.orderNumber} — Tooly.tn Receipt</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: ${isAr ? "'IBM Plex Sans Arabic', sans-serif" : "'Plus Jakarta Sans', sans-serif"};
      background: #090a0f;
      color: #f4f4f5;
      padding: 32px 16px;
      display: flex;
      justify-content: center;
    }
    .ticket-page {
      max-width: 680px;
      width: 100%;
      background: #111218;
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0,0,0,0.6);
    }
    .header {
      background: linear-gradient(135deg, #f52f3d 0%, #a6101c 100%);
      padding: 24px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: white;
    }
    .brand-title { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; }
    .brand-sub { font-size: 11px; opacity: 0.85; text-transform: uppercase; font-family: monospace; }
    .badge {
      background: rgba(0,0,0,0.25);
      border: 1px solid rgba(255,255,255,0.3);
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
    }
    .content { padding: 32px; }
    .order-ref {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding-bottom: 20px;
      border-bottom: 1px dashed rgba(255,255,255,0.15);
      margin-bottom: 24px;
    }
    .ref-code { font-family: monospace; font-size: 24px; font-weight: 800; color: #f52f3d; }
    .section-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #a1a1aa;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .data-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 14px;
    }
    .data-label { font-size: 11px; color: #71717a; margin-bottom: 4px; }
    .data-val { font-size: 14px; font-weight: 700; color: #ffffff; }
    .total-box {
      background: rgba(245, 47, 61, 0.08);
      border: 1px solid rgba(245, 47, 61, 0.3);
      border-radius: 14px;
      padding: 18px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .total-amount { font-size: 28px; font-weight: 900; color: #f52f3d; font-family: monospace; }
    .bank-box {
      background: rgba(255,255,255,0.04);
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.1);
      padding: 16px;
      margin-bottom: 24px;
      font-size: 12px;
      line-height: 1.6;
    }
    .bank-box code {
      background: rgba(0,0,0,0.4);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      color: #38bdf8;
    }
    .barcode-strip {
      text-align: center;
      padding: 20px;
      border-top: 1px dashed rgba(255,255,255,0.15);
      background: #0d0e14;
    }
    .barcode-svg { max-width: 280px; width: 100%; height: 42px; }
    .footer-note { font-size: 10px; color: #71717a; margin-top: 8px; text-align: center; }
    @media print {
      body { background: white; color: black; padding: 0; }
      .ticket-page { box-shadow: none; border: 1px solid #ccc; background: white; color: black; }
      .data-card, .bank-box { background: #f9f9f9; color: black; border-color: #ddd; }
      .data-val { color: black; }
      .total-box { background: #fff1f2; border-color: #f52f3d; }
    }
  </style>
</head>
<body>
  <div class="ticket-page">
    <div class="header">
      <div>
        <div class="brand-title">TOOLY.TN</div>
        <div class="brand-sub">${isAr ? 'وصل تذكرة إلكتروني موثق' : 'Official Verified Order Pass'}</div>
      </div>
      <div class="badge">${order.status}</div>
    </div>
    <div class="content">
      <div class="order-ref">
        <div>
          <div class="data-label">${isAr ? 'رقم مرجع الطلب' : 'Référence de commande'}</div>
          <div class="ref-code">${order.orderNumber}</div>
        </div>
        <div style="text-align: ${isAr ? 'left' : 'right'}">
          <div class="data-label">${isAr ? 'تاريخ الإنشاء' : 'Date d’émission'}</div>
          <div style="font-size: 12px; font-weight: 600; color: #a1a1aa;">${dateStr}</div>
        </div>
      </div>

      <div class="section-title">${isAr ? 'تفاصيل العميل والخدمة' : 'Détails du client et du service'}</div>
      <div class="grid">
        <div class="data-card">
          <div class="data-label">${isAr ? 'العميل' : 'Client'}</div>
          <div class="data-val">${order.customer.name}</div>
          <div style="font-size: 11px; color: #a1a1aa; margin-top: 2px;">${order.customer.phone || order.customer.email || ''}</div>
        </div>
        <div class="data-card">
          <div class="data-label">${isAr ? 'الاشتراك المطلوب' : 'Formule'}</div>
          <div class="data-val">${itemTitle}</div>
          <div style="font-size: 11px; color: #34d399; margin-top: 2px;">${itemDuration} • 100% Garantie</div>
        </div>
      </div>

      <div class="total-box">
        <div>
          <div style="font-size: 12px; font-weight: 700; color: #f52f3d; text-transform: uppercase;">
            ${isAr ? 'المبلغ الإجمالي الصافي' : 'Montant net à régler'}
          </div>
          <div style="font-size: 11px; color: #a1a1aa;">
            ${isAr ? 'دينار تونسي (TND) بدون رسوم إضافية' : 'Dinars Tunisiens (TND) sans frais cachés'}
          </div>
        </div>
        <div class="total-amount">${order.totalAmount.toFixed(0)} TND</div>
      </div>

      <div class="section-title">${isAr ? 'بيانات التحويل البنكي والبريدي (تونس)' : 'Coordonnées de règlement (Tunisie)'}</div>
      <div class="bank-box">
        <div><strong>RIB BIAT / Poste :</strong> <code>08 000 0000000000000 00</code></div>
        <div style="margin-top: 4px;"><strong>D17 Mobile :</strong> <code>+216 98 000 000</code></div>
        <div style="margin-top: 6px; font-size: 11px; color: #a1a1aa;">
          ${
            isAr
              ? `* يرجى إرفاق مرجع الطلب (${order.orderNumber}) في خانة الملاحظات وإرسال الوصل لدعم الواتساب: +216 96 707 406`
              : `* Mentionnez la référence (${order.orderNumber}) lors du virement et envoyez le reçu sur WhatsApp au +216 96 707 406`
          }
        </div>
      </div>
    </div>

    <div class="barcode-strip">
      <svg class="barcode-svg" viewBox="0 0 280 40" fill="white">
        <!-- Stylized barcode bars -->
        <rect x="0" y="0" width="4" height="40" />
        <rect x="7" y="0" width="2" height="40" />
        <rect x="12" y="0" width="6" height="40" />
        <rect x="22" y="0" width="3" height="40" />
        <rect x="28" y="0" width="5" height="40" />
        <rect x="36" y="0" width="2" height="40" />
        <rect x="42" y="0" width="8" height="40" />
        <rect x="54" y="0" width="3" height="40" />
        <rect x="61" y="0" width="5" height="40" />
        <rect x="70" y="0" width="2" height="40" />
        <rect x="76" y="0" width="7" height="40" />
        <rect x="87" y="0" width="3" height="40" />
        <rect x="94" y="0" width="5" height="40" />
        <rect x="103" y="0" width="2" height="40" />
        <rect x="110" y="0" width="4" height="40" />
        <rect x="118" y="0" width="6" height="40" />
        <rect x="128" y="0" width="3" height="40" />
        <rect x="135" y="0" width="7" height="40" />
        <rect x="146" y="0" width="2" height="40" />
        <rect x="152" y="0" width="5" height="40" />
        <rect x="161" y="0" width="4" height="40" />
        <rect x="169" y="0" width="2" height="40" />
        <rect x="175" y="0" width="7" height="40" />
        <rect x="186" y="0" width="4" height="40" />
        <rect x="194" y="0" width="2" height="40" />
        <rect x="200" y="0" width="6" height="40" />
        <rect x="210" y="0" width="3" height="40" />
        <rect x="217" y="0" width="5" height="40" />
        <rect x="226" y="0" width="2" height="40" />
        <rect x="232" y="0" width="7" height="40" />
        <rect x="243" y="0" width="3" height="40" />
        <rect x="250" y="0" width="6" height="40" />
        <rect x="260" y="0" width="2" height="40" />
        <rect x="266" y="0" width="5" height="40" />
        <rect x="275" y="0" width="4" height="40" />
      </svg>
      <div style="font-family: monospace; font-size: 11px; color: #a1a1aa; margin-top: 4px; letter-spacing: 2px;">
        * ${order.orderNumber} *
      </div>
      <div class="footer-note">Tooly.tn — Marketplace d'abonnements digitaux en Tunisie • Support WhatsApp: +216 96 707 406</div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Tooly-Ticket-${order.orderNumber}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function OrderTicketCard({
  order,
  locale,
  defaultTorn = false,
  onTear,
  className = '',
}: OrderTicketCardProps) {
  const isAr = locale === 'ar';
  const [isTorn, setIsTorn] = useState(defaultTorn);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTear = useCallback(() => {
    setIsTorn(true);
    setDownloadSuccess(true);
    downloadOrderReceipt(order, locale);
    onTear?.();
  }, [order, locale, onTear]);

  const handleManualDownload = () => {
    setDownloadSuccess(true);
    downloadOrderReceipt(order, locale);
  };

  const copyRef = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const primaryItem = order.items?.[0];
  const itemTitle = primaryItem?.productTitle || 'Abonnement Digital';
  const itemDuration = primaryItem?.planDuration || '1 mois';

  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      {/* Tearable Interactive Pass Ticket */}
      <div className="w-full max-w-[680px] flex justify-center overflow-visible py-2">
        <TearTicket
          width={640}
          height={320}
          stubSize={170}
          radius={18}
          holes={14}
          holeSize={6}
          notch={4}
          roughness={0.15}
          tearAngle={28}
          stretch={34}
          resistance={0.4}
          rotate={0}
          tilt={true}
          tiltMax={6}
          background="#0d0e14"
          stubBackground="#14151e"
          color="#f4f4f5"
          border={true}
          borderColor="rgba(255, 255, 255, 0.12)"
          torn={isTorn}
          onTear={handleTear}
          ariaLabel={
            isAr
              ? 'اقطع التذكرة لتحميل الوصل'
              : 'Détacher le coupon pour télécharger le reçu'
          }
          stub={
            /* STUB SIDE (THE TEARABLE COUPON) */
            <div className="p-3 h-full flex flex-col items-center justify-between text-center select-none bg-gradient-to-b from-white/[0.04] to-transparent">
              {/* Cut line visual cue */}
              <div className="flex items-center gap-1 text-[9px] font-mono text-tooly-red uppercase tracking-wider font-bold">
                <Scissors className="w-3 h-3 -rotate-90 rtl:rotate-90" />
                <span>{isAr ? 'اقطع هنا' : 'Couper'}</span>
              </div>

              {/* Stylized Barcode SVG */}
              <div className="my-auto flex flex-col items-center gap-1 py-1">
                <svg className="w-24 h-10 text-white/80 fill-current" viewBox="0 0 100 35">
                  <rect x="0" y="0" width="3" height="35" />
                  <rect x="5" y="0" width="1.5" height="35" />
                  <rect x="9" y="0" width="4" height="35" />
                  <rect x="15" y="0" width="2" height="35" />
                  <rect x="19" y="0" width="3" height="35" />
                  <rect x="24" y="0" width="1" height="35" />
                  <rect x="27" y="0" width="5" height="35" />
                  <rect x="34" y="0" width="2" height="35" />
                  <rect x="38" y="0" width="4" height="35" />
                  <rect x="44" y="0" width="1.5" height="35" />
                  <rect x="48" y="0" width="3" height="35" />
                  <rect x="53" y="0" width="4" height="35" />
                  <rect x="59" y="0" width="2" height="35" />
                  <rect x="63" y="0" width="5" height="35" />
                  <rect x="70" y="0" width="1.5" height="35" />
                  <rect x="73" y="0" width="3" height="35" />
                  <rect x="78" y="0" width="2" height="35" />
                  <rect x="82" y="0" width="4" height="35" />
                  <rect x="88" y="0" width="1.5" height="35" />
                  <rect x="92" y="0" width="3" height="35" />
                  <rect x="97" y="0" width="3" height="35" />
                </svg>
                <span className="font-mono text-[9px] text-white/60 tracking-wider">
                  {order.orderNumber}
                </span>
              </div>

              {/* Instruction on stub */}
              <div className="space-y-1">
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-tooly-red text-white shadow-md shadow-tooly-red/40 animate-pulse">
                  <Download className="w-3.5 h-3.5" />
                </div>
                <div className="text-[9px] font-bold text-white uppercase tracking-tight leading-tight">
                  {isAr ? 'اسحب للتحميل' : 'Détacher pour télécharger'}
                </div>
              </div>
            </div>
          }
        >
          {/* TICKET MAIN BODY */}
          <div className="p-4 sm:p-6 h-full flex flex-col justify-between text-start select-none">
            {/* Top Bar: Brand, Status Badge */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-tooly-red flex items-center justify-center text-white font-black text-xs">
                  T
                </div>
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  TOOLY<span className="text-tooly-red">.TN</span>
                </span>
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest hidden sm:inline">
                  • VERIFIED PASS
                </span>
              </div>

              <Badge
                variant={order.status === 'PAID' ? 'success' : 'warning'}
                size="sm"
                className="font-bold text-[10px] sm:text-xs"
              >
                {order.status === 'PAID'
                  ? isAr
                    ? 'مدفوع ومؤكد'
                    : 'Payé & Confirmé'
                  : isAr
                    ? 'قيد انتظار التحويل'
                    : 'En attente de paiement'}
              </Badge>
            </div>

            {/* Center Content: Product & Reference */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 my-auto py-2">
              <div className="sm:col-span-7 space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-tooly-red font-semibold">
                  {isAr ? 'الاشتراك المطلوب' : 'Formule commandée'}
                </span>
                <h3 className="text-base sm:text-xl font-black text-white tracking-tight truncate">
                  {itemTitle}
                </h3>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[11px] font-medium">
                    {itemDuration}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{isAr ? 'ضمان 100%' : 'Garantie 100%'}</span>
                  </span>
                </div>
              </div>

              <div className="sm:col-span-5 flex flex-col sm:items-end justify-center">
                <span className="text-[10px] uppercase font-mono tracking-wider text-white/50">
                  {isAr ? 'المبلغ الصافي' : 'Total net'}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-tooly-red font-mono">
                    {order.totalAmount.toFixed(0)}
                  </span>
                  <span className="text-xs font-bold text-white">TND</span>
                </div>
              </div>
            </div>

            {/* Bottom Bar: Customer & Reference Code */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
              <div className="truncate max-w-[55%]">
                <span className="text-[10px] text-white/40 block truncate">
                  {isAr ? 'العميل المستلم :' : 'Destinataire :'}
                </span>
                <span className="font-semibold text-white truncate block">
                  {order.customer.name}
                </span>
                {(order.customer.phone || order.customer.email) && (
                  <span className="text-[10px] text-white/60 truncate block font-mono">
                    {order.customer.phone || order.customer.email}
                  </span>
                )}
              </div>

              <div className="text-end">
                <span className="text-[10px] text-white/40 block font-mono">
                  {isAr ? 'المرجع :' : 'RÉF :'}
                </span>
                <button
                  type="button"
                  onClick={copyRef}
                  className="font-mono font-bold text-white hover:text-tooly-red transition-colors inline-flex items-center gap-1 text-[11px]"
                  title="Copy reference"
                >
                  <span>{order.orderNumber}</span>
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 opacity-60" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </TearTicket>
      </div>

      {/* Post-tear Notification / Quick Actions */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
        {downloadSuccess ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isAr
                ? 'تم تحميل وصل الطلب بنجاح!'
                : 'Reçu de commande téléchargé avec succès !'}
            </span>
          </div>
        ) : (
          <span className="text-muted text-[11px] font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-tooly-red" />
            <span>
              {isAr
                ? '💡 يمكنك سحب طرف التذكرة لقطعها وتحميل الوصل فوراً'
                : '💡 Tirez le coupon de droite pour le détacher et télécharger le reçu'}
            </span>
          </span>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleManualDownload}
          className="text-xs gap-1.5 border-line"
        >
          <Download className="w-3.5 h-3.5" />
          <span>
            {isAr ? 'تحميل الوصل الموثق (HTML / Print)' : 'Télécharger le reçu'}
          </span>
        </Button>
      </div>
    </div>
  );
}

export default OrderTicketCard;
