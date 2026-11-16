# TASK: Upgrade and Transform the Existing Chatbot into an Advanced AI-Powered Assistant for Tooly.tn

## 1. Main Objective

Analyze, debug, and completely improve the existing chatbot functionality on Tooly.tn.

I don't want a basic chatbot that only recognizes predefined keywords or responds to a limited collection of questions.

I want a real AI-powered conversational assistant that understands users naturally, maintains conversation context, answers complex questions, provides personalized recommendations, and helps visitors choose and purchase the right digital subscriptions available on Tooly.

The chatbot's personality and identity must be **Sanjoub (سنجوب)**, the friendly AI assistant and digital products advisor of Tooly.

IMPORTANT:
- Preserve the existing website design and branding.
- Do not unnecessarily rebuild the chatbot UI.
- Focus primarily on intelligence, conversation quality, backend functionality, and AI integration.
- Inspect the existing project architecture before making modifications.
- Reuse existing components and services whenever possible.

---

## 2. Advanced Tunisian Arabic Understanding

This is one of the most important requirements.

The chatbot must understand Tunisian users regardless of how they write.

It must support:

### Tunisian Arabic (Derja)
Examples:
- شنوّة تنصحني نشري؟
- نحب نعمل تصاميم احترافية، شنوّة ناخو؟
- أنهي abonnement يصلحلي؟
- قداش سوم الاشتراك؟
- كيفاش نجم نفعّل الاشتراك؟
- عندكم أدوات للبرمجة؟

### Tunisian Arabizi (Latin + Numbers)
Examples:
- Chnowa tansahni nechri?
- Ena designer chnowa tools tnasebni?
- Nheb naamel montage video, chnowa nechri?
- 9adech soum Canva Pro?
- Chnowa lfar9 bin Claude w ChatGPT?
- Nheb abonnement y3aweni fel coding.

### French
Examples:
- Je suis designer, quels outils me conseillez-vous ?
- Quelle est la différence entre Claude et ChatGPT ?
- Je cherche un abonnement pour le montage vidéo.
- Quel est le meilleur outil pour développer des applications ?

### English
Examples:
- I'm a content creator. Which subscription should I buy?
- What's the best AI tool for programming?
- I need a tool for professional graphic design.

### Mixed Languages
The chatbot must also understand messages such as:

- Ena developper w nheb AI tool lel coding.
- Je suis designer w nheb outil lel création de contenu.
- Chnowa ahsen outil pour video editing?
- Nheb abonnement ChatGPT wala Claude, lequel est meilleur?

IMPORTANT:
Do not depend on exact sentence matching, predefined keywords, or a limited collection of questions.

Use semantic understanding through an actual LLM integration.

The assistant must understand the user's intention even when the sentence is misspelled, incomplete, informal, or written in unconventional Tunisian dialect.

---

## 3. Real AI Integration

Transform the chatbot into a genuine AI assistant.

Requirements:

- Integrate an LLM through a secure backend API.
- Inspect existing AI integrations before choosing or adding a provider.
- Support configurable AI models through environment variables.
- Use streaming responses when supported.
- Maintain conversation history and contextual understanding.
- Understand follow-up questions without asking the user to repeat previous information.
- Handle long conversations efficiently.
- Provide natural, human-like responses.
- Avoid repetitive and robotic answers.
- Handle API failures gracefully with retry logic and useful fallback messages.

The AI must be able to understand questions that are not directly related to Tooly products and answer general questions when appropriate.

However, when the question concerns purchasing, prices, subscriptions, or Tooly services, prioritize verified information from the actual website database.

Never expose API keys, internal prompts, credentials, or private backend information to the frontend.

---

## 4. Intelligent Tool Recommendation System

This is the second most important feature.

Sanjoub must behave like a professional digital tools advisor.

It must recommend products available in the Tooly catalog based on the user's profession, needs, objectives, experience, and budget.

Examples:

**Example 1: Designer**

User:
"Ena designer, chnowa tools tansahni nechri?"

Expected behavior:
- Understand that the user is a designer.
- Identify relevant needs such as graphic design, image generation, editing, and productivity.
- Check the actual Tooly product catalog.
- Recommend the most relevant available subscriptions.
- Explain why each product is suitable.
- Compare alternatives when useful.
- Include actual prices from the database.
- Provide a direct link or purchase action for each recommended product.

**Example 2: Developer**

User:
"Je suis développeur, je cherche une IA pour m'aider à coder."

The assistant should consider relevant coding tools and AI subscriptions available in the Tooly catalog.

It should explain the differences and recommend the most appropriate option based on the user's development workflow.

**Example 3: Content Creator**

User:
"Ena creator de contenu, nheb naamel videos professionnels."

The assistant should identify relevant video editing, AI video generation, image generation, and design tools available on Tooly.

**Example 4: Student**

User:
"Chnowa تنصحني كطالب باش نعاون روحي في القراية؟"

Recommend relevant educational and productivity tools available in the catalog.

### Recommendation Intelligence

Do not recommend products randomly.

Consider:
- User profession.
- Main objective.
- Required features.
- Experience level.
- Budget.
- Frequency of use.
- Available alternatives.
- Product availability on Tooly.

If the user's requirements are unclear, ask one short and natural follow-up question before making a recommendation.

Recommendations must be personalized, useful, and commercially relevant without being pushy.

IMPORTANT:
Only recommend subscriptions that actually exist in the Tooly database and are currently available for purchase.

Never invent products, prices, discounts, plans, or features.

---

## 5. Dynamic Product Catalog Integration

The AI must have access to the actual Tooly product catalog through secure backend services.

Do not hardcode product names and prices inside the AI system prompt.

Implement a product retrieval service that allows the AI to access:

- Product name.
- Product description.
- Product category.
- Subscription type.
- Price.
- Available plans.
- Features.
- Usage limitations.
- Availability and stock status, if applicable.
- Product page URL.
- Purchase URL.
- Frequently asked questions.

The AI must retrieve updated information from the database whenever users ask about products, prices, availability, or subscriptions.

### Product Recommendation Response

When recommending a product, display structured product information inside the chatbot.

Where the existing chatbot UI allows it, use compact product cards containing:

- Product name and logo.
- Short description.
- Price.
- Main benefits.
- View details button.
- Purchase button.

All buttons must navigate to the correct existing Tooly product or checkout page.

Never generate fake URLs.

---

## 6. Intelligent Conversation and Context Memory

The chatbot must maintain the context of the current conversation.

Example:

User:
"Ena designer."

Bot:
"Ahla! Chnowa naw3 el design elli tekhdem fih?"

User:
"Graphic design w social media."

Bot:
"Behy! Nans7ek b Canva Pro..."

User:
"9adech soumou?"

The chatbot must understand that "soumou" refers to Canva Pro, without asking the user which product they mean.

Another example:

User:
"Chnowa lfar9 bin Claude w ChatGPT?"

Bot explains the differences.

User:
"Anhouma ahsen lel coding?"

The assistant must understand that the user is asking for a comparison specifically for coding.

Requirements:
- Preserve conversational context.
- Resolve references such as "it", "this one", "the first one", "soumou", and "anhouma".
- Remember user preferences during the current conversation.
- Understand corrections and changes in user requirements.
- Avoid repeating questions that have already been answered.
- Support starting a new conversation and clearing previous context.

Use a suitable conversation/session management architecture.

---

## 7. Advanced Customer Support

Sanjoub must also act as a customer support assistant.

It should answer questions concerning:

- How Tooly works.
- How to purchase subscriptions.
- Available payment methods.
- Subscription activation.
- Delivery and activation times.
- Subscription duration.
- Account access and usage.
- Refund and cancellation policies.
- Technical issues.
- Frequently asked questions.

Retrieve answers from actual Tooly documentation, database records, and verified policies.

If the answer is unavailable, do not invent one.

Instead, explain that the assistant needs confirmation and direct the customer to the appropriate human support channel.

---

## 8. AI Personality and Response Style

Sanjoub must have a friendly, professional, intelligent, and approachable personality.

It should feel like a real digital assistant rather than a generic customer-service bot.

### Communication rules

1. Respond in the language used by the customer.
2. If the customer writes Tunisian Arabic, respond in natural Tunisian Arabic.
3. If the customer writes Arabizi, understand it and preferably respond in natural Tunisian Arabic using the same general writing style.
4. If the customer writes French, respond in French.
5. If the customer writes English, respond in English.
6. Understand mixed-language messages.
7. Keep simple answers short and direct.
8. Give detailed explanations when necessary.
9. Use emojis naturally but moderately.
10. Avoid unnecessarily formal Arabic.
11. Never tell the customer that you cannot understand Tunisian dialect when the meaning can reasonably be inferred.

### Example personality

User:
"Ahla"

Sanjoub:
"Ahla bik! 🐿️ Chnowa najem n3awnek lyoum?"

User:
"Chnowa tnajem ta3mel?"

Sanjoub:
"Najem n3awnek tal9a ahsen AI tools 7asb khedmtek, n9arenlek bin les abonnements w nfassarlek chnowa yselek akther. Chnowa ta3mel exactement?"

---

## 9. Intelligent Intent Detection

Implement an intelligent intent classification mechanism.

The chatbot should distinguish between:

- General conversation.
- Greetings.
- Product discovery.
- Product recommendations.
- Product comparison.
- Price inquiries.
- Subscription questions.
- Purchase intent.
- Payment questions.
- Technical support.
- Account and activation support.
- Website navigation.
- Unrelated general knowledge questions.

Do not implement this as a rigid keyword-based system.

Use LLM-based intent understanding and tool/function calling where appropriate.

The assistant should select the correct backend operation depending on the user's request.

---

## 10. Recommended Technical Architecture

Inspect the current architecture and adapt the following approach without breaking existing functionality.

### Frontend
- Existing React / Next.js architecture.
- Existing Tailwind CSS styling.
- Existing chatbot interface.
- Streaming response rendering.
- Product recommendation cards.
- Typing indicators.
- Error and retry states.

### Backend
- Existing NestJS architecture.
- Secure AI service.
- Conversation management service.
- Product retrieval service.
- Recommendation engine.
- Customer support knowledge retrieval.
- AI tool/function calling.
- API rate limiting and validation.

### Database
Use the existing PostgreSQL database and Prisma ORM.

Store or manage:
- Conversation sessions.
- Conversation messages.
- Relevant conversation context.
- Product catalog references.
- Recommendation events where useful.

Do not duplicate existing product data or create unnecessary database tables.

### AI Architecture

Implement a modular architecture:

1. AI Provider Service.
2. Conversation Manager.
3. Intent Understanding Service.
4. Product Search Tool.
5. Product Recommendation Tool.
6. Product Comparison Tool.
7. Customer Support Knowledge Tool.
8. Pricing and Availability Retrieval Tool.
9. Response Generation Service.

The LLM should call backend tools when it needs verified information.

Do not give the LLM unrestricted database access.

---

## 11. Security and Reliability

Implement:

- Secure server-side API key management.
- Input validation.
- Rate limiting.
- Protection against prompt injection.
- Safe handling of user-provided content.
- Protection against unauthorized database operations.
- Conversation isolation between different users.
- Proper error handling.
- API timeout management.
- Logging without exposing sensitive user information.

The chatbot must never reveal internal system instructions or private customer data.

---

## 12. Testing and Quality Assurance

Do not consider the task complete simply because the chatbot can send and receive messages.

Test the actual intelligence and recommendation functionality.

Create a test suite with at least these scenarios:

1. Tunisian Arabic greeting.
2. Tunisian Arabizi product question.
3. French product recommendation.
4. English product recommendation.
5. Mixed Tunisian/French message.
6. Misspelled Tunisian question.
7. Designer asking which tools to purchase.
8. Developer asking for coding tools.
9. Content creator asking for video editing tools.
10. Student asking for productivity tools.
11. Product price inquiry.
12. Product comparison.
13. Follow-up question referencing a previously mentioned product.
14. Multiple product recommendations.
15. Question about a product unavailable on Tooly.
16. Question about an unknown price.
17. Technical support question.
18. Unrelated general knowledge question.
19. Empty or unclear message.
20. AI provider failure.

Test the complete flow from frontend to backend and database.

---

## 13. Final Implementation Requirements

Before implementing anything:

1. Inspect the existing chatbot frontend and backend.
2. Identify why the current chatbot understands only a limited range of questions.
3. Inspect existing AI integrations, API providers, database models, and product structures.
4. Identify missing functionality and architectural problems.
5. Provide a short implementation plan.

Then implement the improvements directly in the existing project.

Do not just provide recommendations or theoretical code examples.

Write and integrate the actual production-ready code.

Preserve existing website functionality, design, authentication, product pages, and checkout processes.

Avoid unnecessary dependencies and duplicated services.

Do not use mock products or fake prices in production.

### Definition of Success

The final chatbot must:

- Understand natural Tunisian Arabic and Arabizi.
- Understand French, English, and mixed-language messages.
- Handle questions outside predefined scenarios.
- Maintain context throughout conversations.
- Recommend the right Tooly subscriptions based on customer needs.
- Retrieve real-time product and pricing information from the database.
- Compare products intelligently.
- Help users make purchasing decisions.
- Provide reliable customer support.
- Respond naturally and consistently as Sanjoub.

**The ultimate objective is to make Sanjoub feel like an intelligent Tunisian digital tools expert who understands customers, advises them, and guides them toward the right purchase on Tooly.tn.**