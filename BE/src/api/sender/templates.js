import emailHtml from "./common-template.js";

const localeDefault = 'fr';
const frontUrl = process.env.APPLICATION_BASE_URL;

export const restoreEmail = async (email = '', link = '', locale = localeDefault) => {
  const { default: t } = await import(`../sender/${locale}.js`);

  return {
    subject: t['Reset your password'],
    body: emailHtml(t, `
    <p>${t['Hello']}</p>
    <p>${t['There was a request to change your password!']}</p>
    <p>
      ${t['Please click this link to change your password']}: <a href='${link}'>${link}</a>
    </p>
    <p>
      ${t['If you did not make this request, you can safely ignore this email']}
    </p>
    <p>
      ${t['See you soon']},
      <br>
      ${t['The Live Pro Shop Team']}
    </p>`)
  };
};

export const welcomeEmail = async (email = '', link = '', locale = localeDefault) => {
  const { default: t } = await import(`../sender/${locale}.js`);

  return {
    subject: t['Account Activation Required'],
    body: emailHtml(t, `
    <p>${t['Hi']}</p>
    <p>
      ${t['Verify yourself below to sign in to your Liveproshop.com account for']} ${email}
    </p>
    <p>
      ${t['Here’s the verification link']}: <a href='${link}'>${t['Click here']}</a>
    </p>
    <p>
      ${t["If you didn't request this verification link, you can safely ignore this email"]}.
    </p>
    <p>
      ${t['The Live Pro Shop Team']}
    </p>`)
  };
};

export const registerEmail = async (email = '', locale = localeDefault) => {
  const { default: t } = await import(`../sender/${locale}.js`);
  // remove from letter cuz user already created
  // <p>
  //   ${t['To access your account and complete your profile, click on the link below']}: <a href='${frontUrl}'>${t['Click for confirmation']}</a>
  // </p>

  return {
    subject: t['Confirmation registration'],
    body: emailHtml(t, `
    <p>${t['Hello']}</p>
    <p>
      ${t['Thank you for joining Live Pro Shop']}. ${t['Your account has been created']}.
    </p>
    
    <p>
      ${t['If you are having trouble logging into your account, contact us at']} info@liveproshop.com
    </p>
    <p>
      ${t['See you soon']},
      <br>
      ${t['The Live Pro Shop Team']}
    </p>`)
  };
};

export const trialSubscriptionEmail = async (email = '', locale = localeDefault) => {
  const { default: t } = await import(`../sender/${locale}.js`);

  return {
    subject: t['Confirmation registration'],
    body: emailHtml(t, `
    <p>${t['Hello']}</p>
    <p>
      ${t['Thank you for joining Live Pro Shop']}. ${t['Your account has been created']}.
    </p>
    <p>
      ${t['To access your account and complete your profile, click on the link below']}: <a href='${frontUrl}'>${t['Click for confirmation']}</a>
    </p>
    <p>
      ${t['If you are having trouble logging into your account, contact us at']} info@liveproshop.com
    </p>
    <p>
      ${t['See you soon']},
      <br>
      ${t['The Live Pro Shop Team']}
    </p>`)
  };
};

export const confirmSubscriptionEmail = async (email = '', locale = localeDefault) => {
  const { default: t } = await import(`../sender/${locale}.js`);

  return {
    subject: t['Subscription confirmed'],
    body: emailHtml(t, `
    <p>${t['Hello']}</p>
    <p>
      ${t['Your subscription has been taken into account.']}.
    </p>
    <p>
      ${t['You can access features by connecting here']}: <a href='${frontUrl}'>${t['Click here']}</a>
    </p>
    <p>
      ${t['If you are having trouble logging into your account, contact us at']} info@liveproshop.com
    </p>
    <p>
      ${t['See you soon']},
      <br>
      ${t['The Live Pro Shop Team']}
    </p>`)
  };
};


export const confirmSubscriptionPaymentEmail = async (email = '', locale = localeDefault, amount = 0) => {
  const { default: t } = await import(`../sender/${locale}.js`);

  return {
    subject: t['Your recurring payment was successful'],
    body: emailHtml(t, `
    <p>${t['Hello']}</p>
    <p>
      ${t['Your recurring payment was successful']}.
    </p>
    <p>
      ${t['Your recurring payment of [amount] EUR  has been completed successfully'].replace('[amount]', amount)}
    </p>
    <p>
      ${t['The account has been renewed']}.
    </p>
    <p>
      ${t['You can find complete details of the features available with your current plan in Subscription info']}.
      <a href='${frontUrl}/account/plan'>${t['Account Plan']}</a>
    </p>
    <p>
      ${t['If you are having trouble logging into your account, contact us at']} info@liveproshop.com
    </p>
    <p>
      ${t['See you soon']},
      <br>
      ${t['The Live Pro Shop Team']}
    </p>`)
  };
};

export const declineSubscriptionPaymentEmail = async (email = '', locale = localeDefault, amount = 0) => {
  const { default: t } = await import(`../sender/${locale}.js`);

  return {
    subject: t['Your account payment has been declined'],
    body: emailHtml(t, `
    <p>${t['Hello']}</p>
    <p>
      ${t['decline_message'].replace('[amount]', amount)}: <a href='${frontUrl}/account/plan'>${t['Account Plan']}</a>
    </p>
    <p>
      ${t['If you are having trouble logging into your account, contact us at']} info@liveproshop.com
    </p>
    <p>
      ${t['See you soon']},
      <br>
      ${t['The Live Pro Shop Team']}
    </p>`)
  };
};


export const supportEmail = async (email = '', locale = localeDefault) => {
  const { default: t } = await import(`../sender/${locale}.js`);

  return {
    subject: t['Proshop'],
    body: emailHtml(t, `
    <p>${t['Hi']}, ${email}!</p>
    <p>
      ${t['Your message has been sent to support!']}
    </p>`)
  };
};

export const supportFromEmail = async (email = '', message, locale = localeDefault) => {
  const { default: t } = await import(`../sender/${locale}.js`);

  return {
    subject: t['Support message from'] + ' ' + email,
    body: emailHtml(t, `
    <p>${t['Support message from']} ${email}!</p>
    <p>
      ${message}
    </p>`)
  };
};

export const contactUsFromEmail = async (name = '', email = '', message, locale = localeDefault) => {
  const { default: t } = await import(`../sender/${locale}.js`);

  return {
    subject: `${t['Contact Us message from']} ${email}`,
    body: emailHtml(t, `
    <p>${t['Contact Us message from']} ${name} (${email})!</p>
    <p>
      ${message}
    </p>`)
  };
};

export const unsubscriberFromEmail = async (email = '', message, locale = localeDefault) => {
  const { default: t } = await import(`../sender/${locale}.js`);

  return {
    subject: t['Unsubscriber message from'] + ' ' + email,
    body: emailHtml(t, `
    <p>${t['Unsubscribe message from']} ${email}!</p>
    <p>
      ${message}
    </p>`)
  };
};

export const requestDemoFromEmail = async (email = '', locale = localeDefault) => {
  const { default: t } = await import(`../sender/${locale}.js`);

  return {
    subject: `${t['Request Demo from']} ${email}`,
    body: emailHtml(t, `
    <p>${t['Request Demo from']} (${email})!</p>`)
  };
};
