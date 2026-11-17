/* ============================================================
   Joey Technology: site configuration
   Edit the values below. This file is loaded on every page.
   ============================================================ */
const CONFIG = {
  whatsapp: "2347032146900",           // international format, digits only (no + or spaces)
  email: "joeyadolson@gmail.com",   // your business email
  web3formsKey: "",                    // free email delivery: paste your Web3Forms access key (see web3forms.com). Used before Netlify Forms.
  useNetlifyForms: true,               // true = submissions appear in your Netlify dashboard (Forms tab)
  webhookUrl: "",                      // optional: n8n webhook URL. If set, it is used first.
  socials: {                           // leave a value empty ("") to hide that link
    LinkedIn: "https://www.linkedin.com/in/adakole-joseph-b887a1174?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    Instagram: "",
    X: "",
    Facebook: "https://www.facebook.com/share/1FKKhyNKuy/?mibextid=wwXIfr",
    YouTube: "",
    GitHub: ""
  },
  industries: ["Select industry","Clinic / Healthcare","School / Education","Real estate","Hotel / Hospitality","Restaurant","Logistics","E-commerce","Consulting / Coaching","Agency","Startup","Other"],
  needs: ["Select what you need","New business website","Website redesign","AI / business automation","Lead generation system","Social media automation","Email marketing automation","CRM / customer management","Website maintenance & growth","SEO & website growth","Free website review","Not sure yet"],
  budgets: ["Select a range","Under ₦100,000","₦100,000–₦200,000","₦200,000–₦350,000","₦350,000–₦600,000","₦600,000+","Under $500 (international)","$500–$1,000","$1,000–$2,500","$2,500+","Not sure yet"],
  timelines: ["Select timeline","As soon as possible","Within 1 month","1–3 months","Flexible"]
};

const WA_BASE = "https://wa.me/" + CONFIG.whatsapp;
