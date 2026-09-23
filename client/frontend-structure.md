# Frontend Folder Structure

```text
src/
├── app/                           # Next.js App Router (All your pages)
│   ├── globals.css                # Global Tailwind CSS
│   ├── layout.jsx                 # Main layout wrapping the entire app
│   ├── page.jsx                   # Home / Landing Page
│   ├── article/
│   │   └── create/page.jsx        # /article/create page
│   ├── feeds/page.jsx             # /feeds page
│   ├── login/page.jsx             # /login page
│   ├── messages/page.jsx          # /messages page
│   ├── mynetwork/page.jsx         # /mynetwork page
│   ├── notification/page.jsx      # /notification page
│   ├── profile/
│   │   └── [id]/page.jsx          # /profile/[id] dynamic page
│   └── signup/page.jsx            # /signup page
│
├── components/                    # Reusable React Components grouped by domain
│   ├── auth/
│   │   ├── GoogleLogin/googlelogincomp.jsx
│   │   └── Route/
│   │       ├── privateroute.jsx
│   │       └── publicroute.jsx
│   │
│   ├── feed/
│   │   ├── AddModel/addmodel.jsx
│   │   ├── Advertisement/advertisement.jsx
│   │   ├── ArticleCard/articlecard.jsx
│   │   └── Post/post.jsx
│   │
│   ├── layout/
│   │   ├── Footer/footer.jsx
│   │   ├── NavbarV1/navbar1.jsx
│   │   └── NavbarV2/navbar2.jsx
│   │
│   ├── messaging/
│   │   ├── Chat/chat.jsx
│   │   └── Conversation/conversation.jsx
│   │
│   ├── profile/
│   │   ├── Experience/experience.jsx
│   │   └── Profile/profile.jsx
│   │
│   ├── shared/                    # Generic components used across multiple domains
│   │   ├── Card/card.jsx
│   │   ├── Model/model.jsx
│   │   ├── Search/search.jsx
│   │   └── SocialActions/
│   │       ├── CommentReplies.jsx
│   │       └── socialactions.jsx
│   │
│   └── ui/                        # Low-level UI atoms
│       ├── button.jsx
│       ├── input.jsx
│       └── textarea.jsx
│
├── data/                          # Mock Data
│   └── user.js
│
├── schemas/                       # Validation Schemas (Yup, Zod, etc.)
│   └── authSchema.js
│
└── utils/                         # Helper functions
    └── auth.js

public/                            # Static assets natively served by Next.js
└── assets/
    ├── hero.png
    ├── image2.jpg
    ├── images.jpg
    ├── react.svg
    └── vite.svg
```
