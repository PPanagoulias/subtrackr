export type SubscriptionCompanyDefaults = {
  key: string;
  names: string[];
  websiteUrl: string;
  managementUrl: string;
  cancelInstructions: string;
};

export const subscriptionCompanyDefaults: SubscriptionCompanyDefaults[] = [
  {
    key: "netflix",
    names: ["netflix"],
    websiteUrl: "https://www.netflix.com",
    managementUrl: "https://www.netflix.com/cancelplan",
    cancelInstructions:
      "Sign in to Netflix, go to Account, then Membership, and choose Cancel Membership. Access usually remains until the end of the current billing period. If you do not see a cancel option, you may be billed through a third party.",
  },
  {
    key: "amazon-prime-video",
    names: ["amazon prime video", "prime video", "amazon prime", "amazon"],
    websiteUrl: "https://www.primevideo.com",
    managementUrl: "https://www.primevideo.com/settings",
    cancelInstructions:
      "Go to Prime Video Account & Settings, then Your Account, and choose End Subscription. If Prime Video is included in Amazon Prime, you may need to cancel through your Amazon Prime membership page.",
  },
  {
    key: "apple-tv",
    names: ["apple tv", "apple tv+", "apple tv plus", "apple"],
    websiteUrl: "https://tv.apple.com",
    managementUrl: "https://tv.apple.com/settings",
    cancelInstructions:
      "On web, sign in and go to Settings, then Subscriptions, Manage, and Cancel Subscription. On iPhone, go to Settings, Apple ID, Subscriptions, Apple TV+, and Cancel.",
  },
  {
    key: "hbo-max",
    names: ["hbo max", "max", "hbomax"],
    websiteUrl: "https://www.max.com",
    managementUrl: "https://www.max.com/subscription",
    cancelInstructions:
      "Sign in to Max, go to Subscription, and choose Cancel Your Subscription. If you are billed through Apple, Google, or another provider, you must cancel through that billing provider.",
  },
  {
    key: "spotify",
    names: ["spotify", "spotify premium"],
    websiteUrl: "https://www.spotify.com",
    managementUrl: "https://www.spotify.com/account/subscription",
    cancelInstructions:
      "Go to your Spotify account, then Manage your plan, and choose Cancel subscription. Premium remains active until the next billing date, then your account changes to Spotify Free.",
  },
  {
    key: "youtube",
    names: ["youtube", "youtube premium", "youtube red", "youtube music"],
    websiteUrl: "https://www.youtube.com",
    managementUrl: "https://www.youtube.com/paid_memberships",
    cancelInstructions:
      "Go to YouTube Paid memberships, select YouTube Premium, choose Manage, then Continue to cancel, and confirm cancellation. If billed through Google Play, cancel from Google Play subscriptions.",
  },
  {
    key: "skroutz-plus",
    names: ["skroutz", "skroutz plus", "skroutz+"],
    websiteUrl: "https://www.skroutz.gr",
    managementUrl: "https://www.skroutz.gr/plus",
    cancelInstructions:
      "Go to Skroutz Plus subscription management, then choose Cancel subscription & refund if eligible, or Disable automatic renewal to avoid future charges.",
  },
  {
    key: "wolt-plus",
    names: ["wolt", "wolt plus", "wolt+"],
    websiteUrl: "https://wolt.com",
    managementUrl: "https://wolt.com",
    cancelInstructions:
      "Open Wolt, go to Profile, then Wolt+, Manage Membership, and Cancel. If you cancel a paid subscription, benefits usually continue until the end of the billing cycle. If you cancel during a free trial, it may stop immediately.",
  },
  {
    key: "surfshark",
    names: ["surfshark", "surfshark vpn"],
    websiteUrl: "https://surfshark.com",
    managementUrl: "https://my.surfshark.com",
    cancelInstructions:
      "Log in to Surfshark, click your email/profile, go to Subscription, Payments, and cancel auto-renewal. If purchased through Apple, Google, or Amazon, cancel from that platform.",
  },
  {
    key: "proton-vpn",
    names: ["proton", "proton vpn", "protonvpn"],
    websiteUrl: "https://protonvpn.com",
    managementUrl: "https://account.proton.me",
    cancelInstructions:
      "Log in to Proton Account, go to Subscription or Plan, and cancel or downgrade to Free. If purchased through App Store or Google Play, cancel from there. Paid features usually remain until the end of the billing period.",
  },
  {
    key: "tidal",
    names: ["tidal"],
    websiteUrl: "https://tidal.com",
    managementUrl: "https://account.tidal.com",
    cancelInstructions:
      "Log in to TIDAL, go to Subscription, choose Cancel Subscription, and confirm. If billed through Apple or Google Play, cancel through Apple or Google instead.",
  },
  {
    key: "disney-plus",
    names: ["disney", "disney+", "disney plus"],
    websiteUrl: "https://www.disneyplus.com",
    managementUrl: "https://www.disneyplus.com/account",
    cancelInstructions:
      "Log in to Disney+, go to Profile, Account, Subscription, and choose Cancel Subscription. Complete the cancellation steps. If billed through a third party, cancel through that provider.",
  },

  {
    key: "cosmote-tv",
    names: ["cosmote", "cosmote tv", "cosmote ott"],
    websiteUrl: "https://www.cosmote.gr",
    managementUrl: "https://www.cosmote.gr/selfcare",
    cancelInstructions:
      "Sign in to your COSMOTE account or My COSMOTE app, go to your services or subscriptions, select COSMOTE TV, and check the available management or cancellation options. If cancellation is not available online, contact COSMOTE support.",
  },
  {
    key: "nova",
    names: ["nova", "nova tv", "nova go", "eon", "eon tv"],
    websiteUrl: "https://www.nova.gr",
    managementUrl: "https://www.nova.gr/myaccount",
    cancelInstructions:
      "Sign in to your Nova account, go to your active services or subscriptions, select the TV or streaming plan, and follow the available cancellation or contract-management steps. If the option is not available online, contact Nova support.",
  },
  {
    key: "vodafone-tv",
    names: ["vodafone", "vodafone tv"],
    websiteUrl: "https://www.vodafone.gr",
    managementUrl: "https://www.vodafone.gr/my-vodafone",
    cancelInstructions:
      "Sign in to My Vodafone, go to your active services, select Vodafone TV or the related subscription, and review cancellation or package management options. If online cancellation is not available, contact Vodafone support.",
  },
  {
    key: "ant1-plus",
    names: ["ant1+", "ant1 plus", "antenna plus"],
    websiteUrl: "https://www.antennaplus.gr",
    managementUrl: "https://www.antennaplus.gr/account",
    cancelInstructions:
      "Sign in to ANT1+, go to Account or Subscription settings, select your active plan, and choose cancel or disable renewal. If you subscribed through Apple or Google Play, manage the subscription from that store instead.",
  },
  {
    key: "ertflix",
    names: ["ertflix", "ert flix"],
    websiteUrl: "https://www.ertflix.gr",
    managementUrl: "https://www.ertflix.gr",
    cancelInstructions:
      "ERTFLIX is generally a free streaming service. If you have created an account, manage account-related settings from the profile or account area. There may be no paid subscription to cancel.",
  },
  {
    key: "cinobo",
    names: ["cinobo"],
    websiteUrl: "https://cinobo.com",
    managementUrl: "https://cinobo.com/account",
    cancelInstructions:
      "Sign in to Cinobo, go to Account or Subscription settings, select your active plan, and choose cancel subscription or disable renewal. Access usually remains until the end of the paid period.",
  },
  {
    key: "mubi",
    names: ["mubi"],
    websiteUrl: "https://mubi.com",
    managementUrl: "https://mubi.com/account",
    cancelInstructions:
      "Sign in to MUBI, go to Account Settings, then Subscription or Billing, and choose cancel subscription. If you subscribed through Apple, Google Play, or another partner, cancel through that provider.",
  },
  {
    key: "nebula",
    names: ["nebula"],
    websiteUrl: "https://nebula.tv",
    managementUrl: "https://nebula.tv/settings",
    cancelInstructions:
      "Sign in to Nebula, go to Settings or Billing, select your subscription, and choose cancel or disable renewal. If billed through a partner bundle, manage the subscription from that provider.",
  },
  {
    key: "patreon",
    names: ["patreon"],
    websiteUrl: "https://www.patreon.com",
    managementUrl: "https://www.patreon.com/settings/memberships",
    cancelInstructions:
      "Sign in to Patreon, go to Memberships, select the creator membership you want to stop, then edit or cancel the membership. Access depends on the creator and billing cycle.",
  },
  {
    key: "onlyfans",
    names: ["onlyfans", "only fans"],
    websiteUrl: "https://onlyfans.com",
    managementUrl: "https://onlyfans.com/my/subscriptions",
    cancelInstructions:
      "Sign in to OnlyFans, go to Subscriptions, select the creator, and turn off auto-renew. The subscription usually remains active until the end of the current billing period.",
  },
  {
    key: "twitch",
    names: ["twitch", "twitch sub", "twitch subscription"],
    websiteUrl: "https://www.twitch.tv",
    managementUrl: "https://www.twitch.tv/subscriptions",
    cancelInstructions:
      "Sign in to Twitch, go to Subscriptions, select the active channel subscription, and choose Do Not Renew or cancel. If subscribed through mobile, manage it through Apple or Google Play.",
  },
  {
    key: "discord-nitro",
    names: ["discord", "discord nitro", "nitro"],
    websiteUrl: "https://discord.com",
    managementUrl: "https://discord.com/billing",
    cancelInstructions:
      "Open Discord, go to User Settings, then Subscriptions or Billing, select Nitro, and choose cancel or manage subscription. If billed through mobile, cancel through Apple or Google Play.",
  },
  {
    key: "playstation-plus",
    names: ["playstation", "playstation plus", "ps plus", "ps+"],
    websiteUrl: "https://www.playstation.com",
    managementUrl: "https://www.playstation.com/acct/subscriptions",
    cancelInstructions:
      "Sign in to your PlayStation account, go to Subscriptions Management, select PlayStation Plus, and turn off auto-renewal or cancel the subscription.",
  },
  {
    key: "xbox-game-pass",
    names: ["xbox", "xbox game pass", "game pass", "pc game pass"],
    websiteUrl: "https://www.xbox.com",
    managementUrl: "https://account.microsoft.com/services",
    cancelInstructions:
      "Sign in to your Microsoft account, go to Services & subscriptions, find Xbox Game Pass, then choose Manage and cancel or turn off recurring billing.",
  },
  {
    key: "ea-play",
    names: ["ea play", "ea access"],
    websiteUrl: "https://www.ea.com/ea-play",
    managementUrl: "https://myaccount.ea.com",
    cancelInstructions:
      "Sign in to your EA account and review your subscription or membership settings. If EA Play was purchased through PlayStation, Xbox, Steam, Apple, or Google, cancel through that platform.",
  },
  {
    key: "nintendo-switch-online",
    names: ["nintendo", "nintendo switch online", "switch online"],
    websiteUrl: "https://www.nintendo.com",
    managementUrl: "https://accounts.nintendo.com",
    cancelInstructions:
      "Sign in to your Nintendo Account, go to Shop Menu, then Nintendo Switch Online, and turn off automatic renewal. You can also manage it from the Nintendo eShop.",
  },
  {
    key: "icloud-plus",
    names: ["icloud", "icloud+", "icloud plus"],
    websiteUrl: "https://www.icloud.com",
    managementUrl: "https://account.apple.com",
    cancelInstructions:
      "Open Apple ID settings, go to iCloud, then Manage Account Storage or Subscriptions, and downgrade or cancel the iCloud+ plan. On Apple devices this is managed through Settings.",
  },
  {
    key: "google-one",
    names: ["google one", "google storage", "google drive storage"],
    websiteUrl: "https://one.google.com",
    managementUrl: "https://one.google.com/settings",
    cancelInstructions:
      "Sign in to Google One, go to Settings, then Membership plan, and choose cancel membership. If subscribed through Google Play, manage it from Google Play subscriptions.",
  },
  {
    key: "adobe",
    names: [
      "adobe",
      "creative cloud",
      "adobe creative cloud",
      "photoshop",
      "lightroom",
    ],
    websiteUrl: "https://www.adobe.com",
    managementUrl: "https://account.adobe.com/plans",
    cancelInstructions:
      "Sign in to your Adobe account, go to Plans, select Manage plan, then choose Cancel your plan. Review any cancellation fees or remaining billing terms before confirming.",
  },
  {
    key: "canva",
    names: ["canva", "canva pro"],
    websiteUrl: "https://www.canva.com",
    managementUrl: "https://www.canva.com/settings/billing-and-plans",
    cancelInstructions:
      "Sign in to Canva, go to Account Settings, then Billing & Plans, select your Canva Pro plan, and choose cancel or pause plan. If billed through Apple or Google Play, cancel there.",
  },
  {
    key: "figma",
    names: ["figma", "figma professional"],
    websiteUrl: "https://www.figma.com",
    managementUrl: "https://www.figma.com/files/team",
    cancelInstructions:
      "Sign in to Figma, open your team or organization settings, go to Billing, and manage or cancel the paid plan. Permissions may be required if you are not the billing admin.",
  },
  {
    key: "notion",
    names: ["notion", "notion plus", "notion ai"],
    websiteUrl: "https://www.notion.so",
    managementUrl: "https://www.notion.so/settings/billing",
    cancelInstructions:
      "Sign in to Notion, go to Settings, then Billing, select your plan, and downgrade or cancel the paid subscription. Workspace owner or admin access may be required.",
  },
  {
    key: "github",
    names: ["github", "github pro", "github copilot", "copilot"],
    websiteUrl: "https://github.com",
    managementUrl: "https://github.com/settings/billing",
    cancelInstructions:
      "Sign in to GitHub, go to Settings, then Billing and plans. For GitHub Copilot or Pro, select the active plan and cancel or downgrade the subscription.",
  },
  {
    key: "chatgpt",
    names: ["chatgpt", "openai", "chatgpt plus", "chatgpt pro"],
    websiteUrl: "https://chatgpt.com",
    managementUrl: "https://chatgpt.com/#settings/Subscription",
    cancelInstructions:
      "Sign in to ChatGPT, open Settings, go to Subscription or Plan, then manage or cancel your paid plan. If subscribed through Apple or Google Play, cancel through that store.",
  },
  {
    key: "linkedin-premium",
    names: ["linkedin", "linkedin premium", "linkedin learning"],
    websiteUrl: "https://www.linkedin.com",
    managementUrl: "https://www.linkedin.com/premium/products",
    cancelInstructions:
      "Sign in to LinkedIn, go to Premium subscription settings, then manage your plan and choose cancel subscription. If purchased through Apple, cancel from Apple subscriptions.",
  },
  {
    key: "coursera",
    names: ["coursera", "coursera plus"],
    websiteUrl: "https://www.coursera.org",
    managementUrl: "https://www.coursera.org/account-settings",
    cancelInstructions:
      "Sign in to Coursera, go to My Purchases or Account Settings, find your subscription, and choose cancel. Access usually remains until the end of the billing period.",
  },
  {
    key: "udemy",
    names: ["udemy", "udemy personal plan"],
    websiteUrl: "https://www.udemy.com",
    managementUrl: "https://www.udemy.com/user/edit-account/subscription",
    cancelInstructions:
      "Sign in to Udemy, go to Subscription settings or Personal Plan management, and choose cancel subscription. If billed through mobile, manage it through Apple or Google Play.",
  },
  {
    key: "skillshare",
    names: ["skillshare"],
    websiteUrl: "https://www.skillshare.com",
    managementUrl: "https://www.skillshare.com/settings/payments",
    cancelInstructions:
      "Sign in to Skillshare, go to Account Settings, then Payments or Membership, and choose cancel membership. If subscribed through Apple or Google Play, cancel from that store.",
  },
  {
    key: "deezer",
    names: ["deezer", "deezer premium"],
    websiteUrl: "https://www.deezer.com",
    managementUrl: "https://www.deezer.com/account/subscription",
    cancelInstructions:
      "Sign in to Deezer, go to Account Settings, then Manage my subscription, and choose cancel. If billed through Apple, Google Play, or a partner, cancel through that provider.",
  },
  {
    key: "audible",
    names: ["audible"],
    websiteUrl: "https://www.audible.com",
    managementUrl: "https://www.audible.com/account/membership",
    cancelInstructions:
      "Sign in to Audible, go to Account Details or Membership settings, select Cancel membership, and follow the confirmation steps. Marketplace rules may vary by country.",
  },
  {
    key: "kindle-unlimited",
    names: ["kindle unlimited"],
    websiteUrl: "https://www.amazon.com/kindle-dbs/hz/subscribe/ku",
    managementUrl: "https://www.amazon.com/mycd",
    cancelInstructions:
      "Sign in to Amazon, go to Memberships & Subscriptions or Manage Your Content and Devices, select Kindle Unlimited, and choose cancel membership.",
  },
  {
    key: "nordvpn",
    names: ["nordvpn", "nord vpn"],
    websiteUrl: "https://nordvpn.com",
    managementUrl: "https://my.nordaccount.com",
    cancelInstructions:
      "Sign in to your Nord Account, go to Billing or Subscriptions, select your active plan, and cancel auto-renewal. If purchased through Apple or Google Play, cancel from that store.",
  },
  {
    key: "expressvpn",
    names: ["expressvpn", "express vpn"],
    websiteUrl: "https://www.expressvpn.com",
    managementUrl: "https://www.expressvpn.com/sign-in",
    cancelInstructions:
      "Sign in to ExpressVPN, go to Subscription or Account settings, and turn off automatic renewal or manage your plan. If billed through an app store, cancel through that platform.",
  },
  {
    key: "revolut-premium",
    names: ["revolut", "revolut premium", "revolut metal", "revolut ultra"],
    websiteUrl: "https://www.revolut.com",
    managementUrl: "https://app.revolut.com",
    cancelInstructions:
      "Open the Revolut app, go to your profile or plan settings, select your paid plan, and choose downgrade or cancel. Review any plan terms or early cancellation fees before confirming.",
  },
  {
    key: "bolt-plus",
    names: ["bolt", "bolt plus", "bolt+"],
    websiteUrl: "https://bolt.eu",
    managementUrl: "https://bolt.eu",
    cancelInstructions:
      "Open the Bolt app, go to your profile or membership area, select the active subscription, and choose cancel or disable renewal if available.",
  },
  {
    key: "efood",
    names: [
      "efood",
      "efood premium",
      "e-food",
      "e food",
      "efood plus",
      "efood+",
    ],
    websiteUrl: "https://www.e-food.gr",
    managementUrl: "https://www.e-food.gr",
    cancelInstructions:
      "Open efood, go to your account or subscription area if available, select the active membership, and manage or cancel it. If no online option exists, contact efood support.",
  },
  {
    key: "freedom24",
    names: ["freedom24", "freedom 24"],
    websiteUrl: "https://freedom24.com",
    managementUrl: "https://freedom24.com",
    cancelInstructions:
      "Sign in to Freedom24, go to account, plan, or billing settings, and review any active subscription or paid service options. Contact support if cancellation is not available online.",
  },
  {
    key: "new-york-times",
    names: ["new york times", "nytimes", "nyt"],
    websiteUrl: "https://www.nytimes.com",
    managementUrl: "https://myaccount.nytimes.com",
    cancelInstructions:
      "Sign in to your New York Times account, go to Account or Subscription settings, select your subscription, and choose cancel or manage subscription.",
  },
  {
    key: "medium",
    names: ["medium"],
    websiteUrl: "https://medium.com",
    managementUrl: "https://medium.com/me/settings",
    cancelInstructions:
      "Sign in to Medium, go to Settings, then Membership, and choose cancel membership. Access typically remains until the end of the current billing period.",
  },
  {
    key: "the-athletic",
    names: ["the athletic", "athletic"],
    websiteUrl: "https://www.nytimes.com/athletic",
    managementUrl: "https://theathletic.com/settings",
    cancelInstructions:
      "Sign in to The Athletic, go to Account Settings or Subscription settings, and choose cancel subscription. If billed through Apple or Google Play, cancel through that store.",
  },
];

function normalizeCompanyName(value: string) {
  return value.trim().toLowerCase();
}

export function getSubscriptionCompanyDefaults(name: string) {
  const normalizedName = normalizeCompanyName(name);

  if (!normalizedName) {
    return null;
  }

  return (
    subscriptionCompanyDefaults.find(function (company) {
      return company.names.some(function (companyName) {
        const normalizedCompanyName = normalizeCompanyName(companyName);

        return (
          normalizedCompanyName === normalizedName ||
          normalizedName.includes(normalizedCompanyName)
        );
      });
    }) || null
  );
}

export function getSubscriptionCompanySuggestions(name: string) {
  const normalizedName = normalizeCompanyName(name);

  if (!normalizedName) {
    return [];
  }

  return subscriptionCompanyDefaults
    .filter(function (company) {
      return company.names.some(function (companyName) {
        const normalizedCompanyName = normalizeCompanyName(companyName);

        return (
          normalizedCompanyName.includes(normalizedName) ||
          normalizedName.includes(normalizedCompanyName)
        );
      });
    })
    .slice(0, 5);
}
