export type Locale = "en" | "hi";

export const dictionaries = {
  en: {
    brand: "Cabin Zindagi",
    nav: {
      home: "Home",
      impact: "Impact",
      stories: "Stories",
      products: "Products & Services",
      contact: "Contact",
    },
    stories: {
      eyebrow: "Voices from the highway",
      heading: "Straight from the Cabin",
      sub: "Real conversations, real lives — the stories India's highways carry, told by the drivers who live them.",
      watchAll: "Watch all stories on YouTube",
      featured: "Featured stories",
      latest: "Latest uploads",
      featuredVideos: [
        { id: "6RSyCKCIqD4", title: "Kamla Kant Pandey — 30 years on the highway" },
        { id: "XQyG_IbX2MY", title: "An e-challan in a truck driver's name?" },
        { id: "AtSSZkuxkz0", title: "Rahul's honest truth — life on the highway" },
      ],
      latestVideos: [
        { id: "U4uuYgOfaos", title: "5 must-do checks before every trip" },
        { id: "_9v25SxvQfk", title: "Rain, fog & rest — what a driver must do" },
        { id: "zg6_DUi6aVQ", title: "Everyone talks fleet — nobody talks driver" },
      ],
      voicesTitle: "In their words",
      voicesSub: "A few of the things drivers have told us, on the record.",
      galleryTitle: "Gallery",
      gallerySub: "Snapshots from the roads and lives of truck drivers.",
      items: [
        {
          name: "Ramesh",
          route: "Delhi – Mumbai corridor",
          quote:
            "Eight months a year I'm on the road. A clean bottle and a place to sleep — small things, but they remind me someone sees us.",
        },
        {
          name: "Satvinder",
          route: "Punjab – Gujarat",
          quote:
            "Nobody asks the driver how he's doing. The day someone filmed my story, my children finally understood my work.",
        },
        {
          name: "Abdul",
          route: "Chennai – Hyderabad",
          quote:
            "A clean wash and a safe park after a 14-hour shift changes everything for the next day's drive.",
        },
        {
          name: "Mahesh",
          route: "Kolkata – Ranchi",
          quote:
            "We move the country's goods, yet we stay invisible. Being heard is the first step to being helped.",
        },
      ],
    },
    home: {
      tagline: "The Human Side of Logistics",
      quote: "Agar Chakkaa nahi Ghumega, Toh Jahaj nahi Udega",
      quoteSub: "If the wheels don't turn, the planes won't fly.",
      title:
        "We document, amplify and protect the lives of India's 9 million truck drivers.",
      subtitle:
        "Through authentic storytelling, community, and on-ground welfare action. Scroll to see why it matters.",
      ctaPrimary: "Partner With Us",
      ctaSecondary: "Our Impact",
      pillarsHeading: "What We Do",
      pillarsSub: "Three pillars that drive everything we build.",
      pillars: [
        {
          title: "Document",
          body: "We record authentic cabin conversations and driver stories through our YouTube channel.",
          detail:
            "We climb into the cabin and record drivers' real, unscripted stories on YouTube — an honest archive of the people who keep India moving.",
        },
        {
          title: "Amplify",
          body: "We elevate driver voices in corporate boardrooms and policy discussions.",
          detail:
            "We carry those voices into boardrooms, policy tables and public campaigns — turning lived experience into real action on driver welfare.",
        },
        {
          title: "Welfare",
          body: "We run on-ground programs — parking subscriptions, health access and care kits.",
          detail:
            "On-ground welfare that's both operational and physical — realistic trip planning, health checks and grievance support, plus care kits and modular portacabin dormitories with ground-floor showers and toilets beneath first-floor sleeping bays.",
        },
      ],
      statsHeading: "Why It Matters",
      statsSub: "The numbers behind India's road freight.",
      stats: [
        { value: "9M+", label: "Truck drivers powering India's economy" },
        { value: "70%", label: "Of India's freight moved by road" },
        { value: "8-10", label: "Months a driver spends away from family each year" },
        { value: "25%", label: "Driver shortage threatening supply chains" },
      ],
      outcome: {
        label: "The Outcome",
        headingLead: "From driver fatigue to",
        headingEmphasis: "operational resilience.",
        beforeLabel: "Before",
        beforeTitle: ["Ignored workforce.", "Systemic exhaustion."],
        before: [
          "Unrealistic delivery schedules",
          "Severe driver fatigue and mental decline",
          "Lack of basic safe facilities",
          "High risk of highway accidents",
        ],
        afterLabel: "After",
        afterTitle: ["Supported drivers.", "Sustainable logistics."],
        after: [
          "Actionable driver welfare policies",
          "Realistic trip planning",
          "Modular rest infrastructure and dormitories",
          "Efficient and safe freight operations",
        ],
      },
    },
    impact: {
      heading: "Our Impact",
      subheading: "Turning attention into action for India's 9 million drivers.",
      associatedWith: "Associated with",
      cta: {
        headLead: "Stand with the people who",
        headStrong: "move India.",
        subLead: "Bring",
        subWord1: "dignity",
        subMid: "and",
        subWord2: "welfare",
        subTail: "to the drivers behind your supply chain.",
        primary: "Partner With Us",
        secondary: "Talk to us",
        quote:
          "“They finally see us — not just the truck. A safe place to sleep and someone telling our story changes everything.”",
        author: "A long-haul driver",
        role: "On the Delhi–Mumbai corridor",
      },
      support: {
        heading: "Back the Mission",
        sub: "Help fund health access, safe rest, and care kits for the drivers who move India.",
        oneTime: "One-time",
        monthly: "Monthly",
        amountLabel: "Choose an amount",
        customPlaceholder: "Other amount (₹)",
        button: "Contribute",
        note: "Secure payment — every rupee goes to driver welfare.",
      },
      journey: [
        {
          title: "The Reality",
          variant: "stats",
          intro:
            "70% of India's freight moves by road — yet the people behind the wheel stay invisible.",
          cards: [
            { title: "9M+", text: "truck drivers power India's economy" },
            { title: "70%", text: "of national freight moves by road" },
            { title: "8–10 months", text: "a year spent away from family" },
            { title: "No safety net", text: "little health cover, unsafe rest, harassment on highways" },
          ],
        },
        {
          title: "Our Work",
          variant: "csr",
          intro:
            "We document driver stories, amplify their voices in boardrooms and policy rooms, and run on-ground welfare — and we help companies do the same. Partner with Cabin Zindagi to build structured welfare programs, tell powerful stories, and fulfil your CSR mandate:",
          cards: [
            { title: "CSR Welfare Programs", text: "Health, insurance & community support for your driver network" },
            { title: "Co-Branded Driver Stories", text: "Authentic content that humanizes your supply chain" },
            { title: "Parking Subscription Program", text: "Subsidize safe parking for your fleet drivers" },
            { title: "Awareness Campaigns", text: "Driver welfare campaigns across digital platforms" },
          ],
        },
        {
          title: "What We're Changing",
          variant: "cards",
          intro: "Real, measurable improvements to drivers' daily lives.",
          cards: [
            { title: "Health access", text: "Coverage and insurance for drivers" },
            { title: "Safe rest", text: "Dignified parking and modular dormitories" },
            { title: "Protection", text: "From harassment and extortion on the road" },
            { title: "Family time", text: "More time and connection back home" },
          ],
        },
        {
          title: "The Outcome",
          variant: "dark",
          intro: "From an ignored workforce to resilient logistics.",
          cards: [
            { title: "Supported drivers", text: "Healthier, safer, and more likely to stay" },
            { title: "Sustainable freight", text: "Fewer shortages and safer highways" },
          ],
        },
      ],
    },
    products: {
      heading: "Products & Services",
      subheading: "Ways to partner with us and stand with India's drivers.",
      learnMore: "Learn more",
      cta: "Explore Welfare Options",
      driversHeading: "Our Products",
      driversSub: "Essentials for drivers, and rest infrastructure for the companies they serve.",
      popular: "Popular",
      buyLabel: "Enquire",
      forDrivers: "For drivers",
      forCompanies: "For companies",
      stays: {
        tag: "For drivers",
        title: "On the road? Book a parking or dhaba stay",
        body: "Find safe truck parking, dhaba meals and clean washrooms along your route — bookable by the hour or overnight.",
        cta: "Book a Stay",
      },
      dormitoryHeading: "Driver Dormitory",
      dormitorySub: "Safe, modular rest infrastructure for drivers on the road.",
      dormitoryBody:
        "Modular portacabin dormitories designed for factories and logistics parks. Built from portable 20ft and 40ft configurations, these multi-level structures place ground-floor showers and toilets beneath comfortable first-floor sleeping bays — prioritizing dignity and rest before the next leg of the journey.",
      dormitoryFeatures: [
        "Modular 20ft & 40ft portacabins",
        "Comfortable first-floor sleeping bays",
        "Ground-floor showers & toilets",
        "Built for factories & logistics parks",
      ],
      offerHeading: "What We Offer",
      offerCards: [
        {
          title: "Manufacturing",
          body: "Factory-built porta cabin dormitory units using standard modular sizes, insulation, structural framing, stair access, sleeping layouts, plumbing-ready wet areas and electrical integration.",
          points: [
            "20ft and 40ft standard modules",
            "Stacked same-size container configuration",
            "Custom internal planning as per site traffic",
          ],
        },
        {
          title: "Supply & deployment",
          body: "End-to-end support from concept sizing to dispatch, placement and site deployment for factories, fleet yards, industrial estates, warehouses and transport terminals.",
          points: [
            "Installation-ready modular blocks",
            "Coordination for utility connections",
            "Multi-site rollout possible",
          ],
        },
        {
          title: "Driver-centric planning",
          body: "The layout is meant for short-stay resting, wash-up, shift change and waiting time between loading and dispatch cycles.",
          points: [
            "Separate wet and dry usage zones",
            "High-density but structured sleeping plan",
            "Suitable for continuous site operations",
          ],
        },
      ],
      tableHeaders: ["Model", "Structure", "Capacity", "Ideal deployment"],
      tableRows: [
        ["20ft Driver Dorm", "2 stacked 20ft porta cabins", "12 beds", "Medium truck inflow factories, warehouses, yards"],
        ["40ft Driver Dorm", "2 stacked 40ft porta cabins", "24 beds", "Large industrial plants, logistics parks, transport hubs"],
        ["Custom cluster layout", "Multiple stacked modules", "As per requirement", "Multi-bay sites, high truck wait time locations"],
      ],
      layoutCaption: "Standard 20ft module layout",
      bedsCaption: "First-floor sleeping bays",
      showerCaption: "Ground-floor wash & toilet block",
    },
    contact: {
      heading: "Contact Us",
      subheading: "Send us a message and we'll reply by email.",
      description:
        "We're always looking for ways to better support India's drivers. Reach out and tell us how we can help.",
      fullName: "Full name",
      emailAddress: "Email Address",
      company: "Company",
      messageLabel: "Message",
      interestsLabel: "I'm interested in...",
      interests: [
        "CSR Welfare Partnership",
        "Co-branded Driver Stories",
        "Parking Subscription (Corporate)",
        "Investment / Funding",
        "Media / Press",
        "General Enquiry",
      ],
      namePlaceholder: "Your full name",
      emailPlaceholder: "you@example.com",
      companyPlaceholder: "Company / organisation",
      messagePlaceholder: "Type your message here",
      send: "Send message",
      sending: "Sending...",
      success: "Message sent! We'll be in touch soon.",
      error: "Something went wrong. Please try again.",
      reachUs: "Or reach us directly at",
      hereLabel: "We are here",
    },
    footer: {
      tagline: "The human side of logistics.",
      explore: "Explore",
      connect: "Connect",
      rights: "All rights reserved.",
    },
  },
  hi: {
    brand: "केबिन ज़िंदगी",
    nav: {
      home: "होम",
      impact: "प्रभाव",
      stories: "कहानियाँ",
      products: "उत्पाद और सेवाएँ",
      contact: "संपर्क",
    },
    stories: {
      eyebrow: "हाईवे की आवाज़ें",
      heading: "सीधे केबिन से",
      sub: "असली बातचीत, असली ज़िंदगियाँ — भारत के हाईवे जो कहानियाँ संजोते हैं, उन्हीं ड्राइवरों की ज़ुबानी जो उन्हें जीते हैं।",
      watchAll: "यूट्यूब पर सभी कहानियाँ देखें",
      featured: "चुनिंदा कहानियाँ",
      latest: "नए वीडियो",
      featuredVideos: [
        { id: "6RSyCKCIqD4", title: "कमला कांत पांडे की कहानी — 30 साल हाईवे पर" },
        { id: "XQyG_IbX2MY", title: "ट्रक ड्राइवर के नाम e-चालान? अभी चेक करो!" },
        { id: "AtSSZkuxkz0", title: "ट्रक ड्राइवर राहुल की सच्ची बात — हाईवे पर ज़िंदगी" },
      ],
      latestVideos: [
        { id: "U4uuYgOfaos", title: "ट्रिप शुरू करने से पहले 5 ज़रूरी काम" },
        { id: "_9v25SxvQfk", title: "बारिश, कोहरे में ड्राइवर क्या करे? आराम कितना ज़रूरी है" },
        { id: "zg6_DUi6aVQ", title: "फ्लीट की बात सब करते हैं, ड्राइवर की कोई नहीं!" },
      ],
      voicesTitle: "उनके अपने शब्दों में",
      voicesSub: "ड्राइवरों ने हमें जो बताया, उसमें से कुछ — रिकॉर्ड पर।",
      galleryTitle: "गैलरी",
      gallerySub: "ड्राइवरों की सड़कों और ज़िंदगियों की झलकियाँ।",
      items: [
        {
          name: "रमेश",
          route: "दिल्ली – मुंबई कॉरिडोर",
          quote:
            "साल में आठ महीने मैं सड़क पर रहता हूँ। एक साफ़ बोतल और सोने की जगह — छोटी चीज़ें, पर याद दिलाती हैं कि कोई हमें देखता है।",
        },
        {
          name: "सतविंदर",
          route: "पंजाब – गुजरात",
          quote:
            "कोई ड्राइवर से नहीं पूछता कि वह कैसा है। जिस दिन किसी ने मेरी कहानी फिल्माई, मेरे बच्चे आख़िरकार मेरे काम को समझे।",
        },
        {
          name: "अब्दुल",
          route: "चेन्नई – हैदराबाद",
          quote:
            "14 घंटे की शिफ्ट के बाद साफ़ नहाना और सुरक्षित पार्किंग अगले दिन की ड्राइव बदल देती है।",
        },
        {
          name: "महेश",
          route: "कोलकाता – रांची",
          quote:
            "हम देश का सामान ढोते हैं, फिर भी हम अनदेखे रहते हैं। सुना जाना मदद पाने का पहला कदम है।",
        },
      ],
    },
    home: {
      tagline: "लॉजिस्टिक्स का मानवीय पक्ष",
      quote: "अगर चक्का नहीं घूमेगा, तो जहाज़ नहीं उड़ेगा",
      quoteSub: "अगर पहिए नहीं घूमेंगे, तो हवाई जहाज़ नहीं उड़ेंगे।",
      title:
        "हम भारत के 90 लाख ट्रक ड्राइवरों के जीवन का दस्तावेज़ीकरण, प्रचार और संरक्षण करते हैं।",
      subtitle:
        "प्रामाणिक कहानियों, समुदाय और ज़मीनी कल्याण कार्यों के माध्यम से। यह क्यों ज़रूरी है, जानने के लिए स्क्रॉल करें।",
      ctaPrimary: "हमारे साथ जुड़ें",
      ctaSecondary: "हमारा प्रभाव",
      pillarsHeading: "हम क्या करते हैं",
      pillarsSub: "तीन स्तंभ जिन पर हमारा सब कुछ टिका है।",
      pillars: [
        {
          title: "दस्तावेज़ीकरण",
          body: "हम अपने यूट्यूब चैनल के ज़रिए केबिन की असली बातचीत और ड्राइवरों की कहानियाँ रिकॉर्ड करते हैं।",
          detail:
            "हम केबिन में बैठकर ड्राइवरों की असली, बिना स्क्रिप्ट वाली कहानियाँ यूट्यूब पर रिकॉर्ड करते हैं — उन लोगों का एक ईमानदार संग्रह जो भारत को चलाते रहते हैं।",
        },
        {
          title: "प्रचार",
          body: "हम कॉर्पोरेट बोर्डरूम और नीति चर्चाओं में ड्राइवरों की आवाज़ को आगे लाते हैं।",
          detail:
            "हम उन आवाज़ों को बोर्डरूम, नीति-निर्माण और सार्वजनिक अभियानों तक ले जाते हैं, और जीवित अनुभव को ड्राइवर कल्याण पर ठोस कार्य में बदलते हैं।",
        },
        {
          title: "कल्याण",
          body: "हम ज़मीनी कार्यक्रम चलाते हैं — पार्किंग सब्सक्रिप्शन, स्वास्थ्य सुविधा और केयर किट।",
          detail:
            "ज़मीनी कल्याण जो परिचालन और भौतिक दोनों है — यथार्थवादी यात्रा योजना, स्वास्थ्य जाँच और शिकायत निवारण, साथ ही केयर किट और मॉड्यूलर पोर्टाकेबिन डॉर्मिटरी जिनमें पहली मंज़िल के स्लीपिंग बे के नीचे भूतल पर शॉवर और शौचालय होते हैं।",
        },
      ],
      statsHeading: "यह क्यों मायने रखता है",
      statsSub: "भारत के सड़क माल ढुलाई के पीछे के आँकड़े।",
      stats: [
        { value: "90 लाख+", label: "ट्रक ड्राइवर जो भारत की अर्थव्यवस्था चलाते हैं" },
        { value: "70%", label: "भारत का माल सड़क मार्ग से ढोया जाता है" },
        { value: "8-10", label: "महीने एक ड्राइवर हर साल परिवार से दूर बिताता है" },
        { value: "25%", label: "ड्राइवरों की कमी जो आपूर्ति शृंखला के लिए ख़तरा है" },
      ],
      outcome: {
        label: "परिणाम",
        headingLead: "ड्राइवर थकान से",
        headingEmphasis: "परिचालन लचीलेपन तक।",
        beforeLabel: "पहले",
        beforeTitle: ["उपेक्षित कार्यबल।", "व्यवस्थागत थकावट।"],
        before: [
          "अवास्तविक डिलीवरी समय-सारणी",
          "गंभीर ड्राइवर थकान और मानसिक गिरावट",
          "बुनियादी सुरक्षित सुविधाओं की कमी",
          "राजमार्ग दुर्घटनाओं का उच्च जोखिम",
        ],
        afterLabel: "बाद में",
        afterTitle: ["समर्थित ड्राइवर।", "टिकाऊ लॉजिस्टिक्स।"],
        after: [
          "क्रियान्वित करने योग्य ड्राइवर कल्याण नीतियाँ",
          "यथार्थवादी यात्रा योजना",
          "मॉड्यूलर विश्राम अवसंरचना और डॉर्मिटरी",
          "कुशल और सुरक्षित माल ढुलाई",
        ],
      },
    },
    impact: {
      heading: "हमारा प्रभाव",
      subheading: "भारत के 90 लाख ड्राइवरों के लिए ध्यान को कार्य में बदलना।",
      associatedWith: "सहयोगी",
      cta: {
        headLead: "उन लोगों के साथ खड़े हों जो",
        headStrong: "भारत को चलाते हैं।",
        subLead: "अपनी आपूर्ति शृंखला के पीछे के ड्राइवरों के लिए",
        subWord1: "गरिमा",
        subMid: "और",
        subWord2: "कल्याण",
        subTail: "लेकर आएं।",
        primary: "हमारे साथ जुड़ें",
        secondary: "हमसे बात करें",
        quote:
          "“अब वे हमें देखते हैं — सिर्फ़ ट्रक को नहीं। सोने की एक सुरक्षित जगह और हमारी कहानी कहने वाला कोई — सब कुछ बदल देता है।”",
        author: "एक लंबी दूरी का ड्राइवर",
        role: "दिल्ली–मुंबई मार्ग पर",
      },
      support: {
        heading: "मिशन का समर्थन करें",
        sub: "भारत को चलाने वाले ड्राइवरों के लिए स्वास्थ्य सुविधा, सुरक्षित विश्राम और केयर किट का वित्तपोषण करें।",
        oneTime: "एक बार",
        monthly: "मासिक",
        amountLabel: "राशि चुनें",
        customPlaceholder: "अन्य राशि (₹)",
        button: "योगदान करें",
        note: "सुरक्षित भुगतान — हर रुपया ड्राइवर कल्याण में जाता है।",
      },
      journey: [
        {
          title: "वास्तविकता",
          variant: "stats",
          intro:
            "भारत का 70% माल सड़क मार्ग से चलता है — फिर भी पहिए के पीछे के लोग अनदेखे रह जाते हैं।",
          cards: [
            { title: "90 लाख+", text: "ट्रक ड्राइवर भारत की अर्थव्यवस्था चलाते हैं" },
            { title: "70%", text: "राष्ट्रीय माल सड़क मार्ग से चलता है" },
            { title: "8–10 महीने", text: "साल में परिवार से दूर बिताए जाते हैं" },
            { title: "कोई सुरक्षा नहीं", text: "कम स्वास्थ्य सुविधा, असुरक्षित विश्राम, उत्पीड़न" },
          ],
        },
        {
          title: "हमारा काम",
          variant: "csr",
          intro:
            "हम ड्राइवरों की कहानियाँ दर्ज करते हैं, उनकी आवाज़ बोर्डरूम और नीति-निर्माण तक पहुँचाते हैं, और ज़मीन पर कल्याण चलाते हैं — और हम कंपनियों को भी यही करने में मदद करते हैं। संरचित कल्याण कार्यक्रम बनाने, सशक्त कहानियाँ बताने और अपने सीएसआर लक्ष्य को पूरा करने के लिए केबिन ज़िंदगी के साथ जुड़ें:",
          cards: [
            { title: "सीएसआर कल्याण कार्यक्रम", text: "आपके ड्राइवर नेटवर्क के लिए स्वास्थ्य, बीमा और सामुदायिक सहायता" },
            { title: "सह-ब्रांडेड ड्राइवर कहानियाँ", text: "प्रामाणिक सामग्री जो आपकी आपूर्ति शृंखला को मानवीय बनाती है" },
            { title: "पार्किंग सब्सक्रिप्शन कार्यक्रम", text: "अपने बेड़े के ड्राइवरों के लिए सुरक्षित पार्किंग को सब्सिडी दें" },
            { title: "जागरूकता अभियान", text: "डिजिटल प्लेटफ़ॉर्म पर ड्राइवर कल्याण अभियान" },
          ],
        },
        {
          title: "हम क्या बदल रहे हैं",
          variant: "cards",
          intro: "ड्राइवरों के दैनिक जीवन में वास्तविक, ठोस सुधार।",
          cards: [
            { title: "स्वास्थ्य पहुँच", text: "ड्राइवरों के लिए कवरेज और बीमा" },
            { title: "सुरक्षित विश्राम", text: "सम्मानजनक पार्किंग और मॉड्यूलर डॉर्मिटरी" },
            { title: "सुरक्षा", text: "सड़क पर उत्पीड़न और वसूली से" },
            { title: "परिवार का समय", text: "घर पर अधिक समय और जुड़ाव" },
          ],
        },
        {
          title: "परिणाम",
          variant: "dark",
          intro: "उपेक्षित कार्यबल से लेकर लचीली लॉजिस्टिक्स तक।",
          cards: [
            { title: "समर्थित ड्राइवर", text: "स्वस्थ, सुरक्षित और टिके रहने वाले" },
            { title: "टिकाऊ माल ढुलाई", text: "कम कमी और सुरक्षित राजमार्ग" },
          ],
        },
      ],
    },
    products: {
      heading: "उत्पाद और सेवाएँ",
      subheading: "हमारे साथ जुड़ने और भारत के ड्राइवरों के साथ खड़े होने के तरीके।",
      learnMore: "और जानें",
      cta: "कल्याण विकल्प देखें",
      driversHeading: "हमारे उत्पाद",
      driversSub: "ड्राइवरों के लिए ज़रूरी चीज़ें, और जिन कंपनियों की वे सेवा करते हैं उनके लिए विश्राम अवसंरचना।",
      popular: "लोकप्रिय",
      buyLabel: "पूछताछ करें",
      forDrivers: "ड्राइवरों के लिए",
      forCompanies: "कंपनियों के लिए",
      stays: {
        tag: "ड्राइवरों के लिए",
        title: "सफ़र में हैं? पार्किंग या ढाबा स्टे बुक करें",
        body: "अपने रूट पर सुरक्षित ट्रक पार्किंग, ढाबा भोजन और साफ़ शौचालय खोजें — घंटे के हिसाब से या रातभर के लिए बुक करें।",
        cta: "स्टे बुक करें",
      },
      dormitoryHeading: "ड्राइवर डॉर्मिटरी",
      dormitorySub: "सड़क पर ड्राइवरों के लिए सुरक्षित, मॉड्यूलर विश्राम अवसंरचना।",
      dormitoryBody:
        "कारखानों और लॉजिस्टिक्स पार्कों के लिए डिज़ाइन की गई मॉड्यूलर पोर्टाकेबिन डॉर्मिटरी। पोर्टेबल 20 फुट और 40 फुट विन्यास से बनी ये बहु-स्तरीय संरचनाएँ आरामदायक पहली मंज़िल के स्लीपिंग बे के नीचे भूतल पर शॉवर और शौचालय रखती हैं — अगले सफ़र से पहले गरिमा और विश्राम को प्राथमिकता देते हुए।",
      dormitoryFeatures: [
        "मॉड्यूलर 20 फुट और 40 फुट पोर्टाकेबिन",
        "आरामदायक पहली मंज़िल स्लीपिंग बे",
        "भूतल पर शॉवर और शौचालय",
        "कारखानों और लॉजिस्टिक्स पार्कों के लिए",
      ],
      offerHeading: "हम क्या प्रदान करते हैं",
      offerCards: [
        {
          title: "निर्माण",
          body: "मानक मॉड्यूलर आकार, इन्सुलेशन, संरचनात्मक ढाँचा, सीढ़ी पहुँच, स्लीपिंग लेआउट, प्लंबिंग-रेडी वेट एरिया और विद्युत एकीकरण के साथ कारखाने में निर्मित पोर्टा केबिन डॉर्मिटरी यूनिट।",
          points: [
            "20 फुट और 40 फुट मानक मॉड्यूल",
            "समान-आकार के कंटेनर का स्टैक्ड विन्यास",
            "साइट ट्रैफ़िक के अनुसार कस्टम आंतरिक योजना",
          ],
        },
        {
          title: "आपूर्ति और तैनाती",
          body: "कारखानों, फ्लीट यार्ड, औद्योगिक क्षेत्रों, गोदामों और परिवहन टर्मिनलों के लिए कॉन्सेप्ट साइज़िंग से डिस्पैच, प्लेसमेंट और साइट तैनाती तक एंड-टू-एंड सहायता।",
          points: [
            "इंस्टॉलेशन-रेडी मॉड्यूलर ब्लॉक",
            "यूटिलिटी कनेक्शन के लिए समन्वय",
            "मल्टी-साइट रोलआउट संभव",
          ],
        },
        {
          title: "ड्राइवर-केंद्रित योजना",
          body: "यह लेआउट लोडिंग और डिस्पैच चक्रों के बीच अल्प-प्रवास विश्राम, धुलाई, शिफ्ट परिवर्तन और प्रतीक्षा समय के लिए बनाया गया है।",
          points: [
            "अलग गीले और सूखे उपयोग क्षेत्र",
            "उच्च-घनत्व पर संरचित स्लीपिंग प्लान",
            "निरंतर साइट संचालन के लिए उपयुक्त",
          ],
        },
      ],
      tableHeaders: ["मॉडल", "संरचना", "क्षमता", "आदर्श तैनाती"],
      tableRows: [
        ["20 फुट ड्राइवर डॉर्म", "2 स्टैक्ड 20 फुट पोर्टा केबिन", "12 बेड", "मध्यम ट्रक आवक कारखाने, गोदाम, यार्ड"],
        ["40 फुट ड्राइवर डॉर्म", "2 स्टैक्ड 40 फुट पोर्टा केबिन", "24 बेड", "बड़े औद्योगिक संयंत्र, लॉजिस्टिक्स पार्क, परिवहन हब"],
        ["कस्टम क्लस्टर लेआउट", "कई स्टैक्ड मॉड्यूल", "आवश्यकता के अनुसार", "मल्टी-बे साइट, उच्च ट्रक प्रतीक्षा समय वाले स्थान"],
      ],
      layoutCaption: "मानक 20 फुट मॉड्यूल लेआउट",
      bedsCaption: "पहली मंज़िल स्लीपिंग बे",
      showerCaption: "भूतल वॉश और शौचालय ब्लॉक",
    },
    contact: {
      heading: "संपर्क करें",
      subheading: "हमें संदेश भेजें और हम ईमेल द्वारा उत्तर देंगे।",
      description:
        "हम भारत के ड्राइवरों का बेहतर समर्थन करने के तरीके खोजते रहते हैं। हमसे संपर्क करें और बताएं कि हम कैसे मदद कर सकते हैं।",
      fullName: "पूरा नाम",
      emailAddress: "ईमेल पता",
      company: "कंपनी",
      messageLabel: "संदेश",
      interestsLabel: "मुझे इसमें रुचि है...",
      interests: [
        "सीएसआर कल्याण साझेदारी",
        "सह-ब्रांडेड ड्राइवर कहानियाँ",
        "पार्किंग सब्सक्रिप्शन (कॉर्पोरेट)",
        "निवेश / फंडिंग",
        "मीडिया / प्रेस",
        "सामान्य पूछताछ",
      ],
      namePlaceholder: "आपका पूरा नाम",
      emailPlaceholder: "you@example.com",
      companyPlaceholder: "कंपनी / संगठन",
      messagePlaceholder: "अपना संदेश यहाँ लिखें",
      send: "संदेश भेजें",
      sending: "भेजा जा रहा है...",
      success: "संदेश भेज दिया गया! हम जल्द ही संपर्क करेंगे।",
      error: "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
      reachUs: "या हमसे सीधे संपर्क करें",
      hereLabel: "हम यहाँ हैं",
    },
    footer: {
      tagline: "लॉजिस्टिक्स का मानवीय पक्ष।",
      explore: "एक्सप्लोर",
      connect: "जुड़ें",
      rights: "सर्वाधिकार सुरक्षित।",
    },
  },
};

export type Dictionary = (typeof dictionaries)["en"];
