import emailHtml from "./common-template.js";

const localeDefault = 'fr';
const frontUrl = process.env.APPLICATION_BASE_URL;

export const sendPlatinumEmail = async (user = '', locale) => {
  const { default: t } = await import(`../sender/${locale ? locale : 'fr'}.js`);
  return {
    subject: t['Platinum Plan Request'],
    body: emailHtml(t, `
    <p>${t['Hello']}</p>
    <p>
      ${t['Platinum Plan Request']}: 
    </p>
    <p>
      <a href="mailto:${user.email}">${user.email}</a>, 
    </p>
    <p>
      ${user.first_name} ${user.last_name}
    </p>
    <p>
      ${t['The Live Pro Shop Team']}
    </p>`)
  };
};

export const restoreEmail = async (email = '', link = '', locale = localeDefault) => {
  const { default: t } = await import(`../sender/${locale}.js`);

  return {
    subject: t['Forgot password'],
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
    </p>
    <p>  
      ${t['The Live Pro Shop Team']}
    </p>`)
  };
};

export const welcomeEmail = async (email = '', link = '', locale = localeDefault) => {
  const { default: t } = await import(`../sender/${locale}.js`);
  return {
    subject: t['Verification email'],
    body: emailHtml(t, `
    <p>${t['Hi']}</p>
    <p>
      ${t['Verify yourself below to sign in to your ']} <a href="https://liveproshop.com${locale=== 'en' ? '/en' : ''}">Liveproshop.com</a> ${t['account for']} ${email}
    </p>
    <p>
      ${t['confirm_link']}: <a href='${link}'>${t['Click here']}</a>
    </p>
    <p>
      ${t["If you didn't request this verification link, you can safely ignore this email"]}.
    </p>
    <p>
      ${t['The Live Pro Shop Team']}
    </p>`)
  };
};


export const sessionSyncEmail = async (data, locale) => {
  const { default: t } = await import(`../sender/${locale}.js`);
  return {
    subject: t['Your account needs to be synchronized'],
    body: emailHtml(t, `
    <p>${t['Hello']}</p>
    <p>${t['You have scheduled a live session and it`s about to start']}</p>
    <p>${t['schtext_1']}</p>
    <p>${t['schtext_2']}</p>
    <p>${t['schtext_3']} <a href="https://liveproshop.com${locale=== 'en' ? '/en' : ''}/full-guide/livesession" target="_blank">${t['schtext_4']}</a></p>
    <p>
      ${t['See you soon']},
    </p>
    <p>
      ${t['The Live Pro Shop Team']}
    </p>`)
  };
};


export const changeSubscriptionPlanEmail = async (email = '', link = '', locale = localeDefault) => {
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
      ${t['If you are having trouble logging into your account, contact us at']} <a href="mailto:info@liveproshop.com">info@liveproshop.com</a>
    </p>
    <p>
      ${t['See you soon']},
    </p>
    <p>
      ${t['The Live Pro Shop Team']}
    </p>`)
  };

};

export const confirmVerificationEmail = async (email = '', locale = localeDefault, link='') => {
  const { default: t } = await import(`../sender/${locale}.js`);

  return {
    subject: t['Email confirmation'],
    body: emailHtml(t, `
    <p>${t['Hello']}</p>
    <p>
      ${t['Thank you for joining Live Pro Shop. Your account has been created.']}
    </p>
    <p>
      ${t['To access your account and complete your profile, click on the link below:']} 
    </p>
    <p>
        <a href="${link}">${t['Click here']}</a>
    </p>
    <p>
      ${t["If you are having trouble logging into your account, contact us at "]}
    </p>
    <p>
       <a href="mailto:info@liveproshop.com">info@liveproshop.com</a></a>
    </p>
    <p>
      ${t["See you soon,"]}
    </p>
    <p>
      ${t['The Live Pro Shop Team']}
    </p>`)
  };
};

export const subscriptionEmail = async (email = '', link = '', locale = localeDefault) => {
  const { default: t } = await import(`../sender/${locale}.js`);
  return {
    subject: t['Email confirmation'],
    body: emailHtml(t, `
    <p>${t['Hello']}</p>
    <p>
      ${t['Thank you for joining Live Pro Shop. Your account has been created.']}
    </p>
    <p>
      ${t['To access your account and complete your profile, click on the link below:']}: <a href='${link}'>${t['Click here']}</a>
    </p>
    <p>
      ${t["If you are having trouble logging into your account, contact us at "]}. <a href="mailto:info@liveproshop.com">info@liveproshop.com</a></a>
    </p>
    <p>
      ${t["See you soon,"]}
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
      ${t['If you are having trouble logging into your account, contact us at']} <a href="mailto:info@liveproshop.com">info@liveproshop.com</a>
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
      ${t['If you are having trouble logging into your account, contact us at']} <a href="mailto:info@liveproshop.com">info@liveproshop.com</a>
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
      ${t['Your subscription has been taken into account']}
    </p>
    <p>
      ${t['You can access features by connecting here']}: <a href='${frontUrl+(locale === 'en' ? '/en' :'')}'>${t['Click here']}</a>
    </p>
    <p></p>
    <p>
      ${t['See you soon']},
      <br>
      ${t['The Live Pro Shop Team']}
    </p>`)
  };
};

export const confirmShippedEmail = async (email = '', locale = localeDefault, data = array()) => {
  const { default: t } = await import(`../sender/${locale}.js`);
  const linkUrl = frontUrl+(locale === 'fr' ? '' : '/en');
  console.log(linkUrl)
  return {
    subject: `${data['store_name']} ${t['Your order has been shipped']}`,
    body: emailHtml(t, `
    <p>${t['Hello']},</p>
    <p>
      ${t['We confirm that your order has been shipped']} <a href='${linkUrl}'>${data['order_number']}</a>
    </p>
    <p>
      ${t['You can track your order at any time by clicking on the tracking number or by contacting your merchant.']}
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
      ${t['If you are having trouble logging into your account, contact us at']} <a href="mailto:info@liveproshop.com">info@liveproshop.com</a>
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
      ${t['If you are having trouble logging into your account, contact us at']} <a href="mailto:info@liveproshop.com">info@liveproshop.com</a>
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


export const confirmOrderPaymentEmail = async (locale = localeDefault, sellerName, order, deliveryAddress, paymentMethod) => {
  const { default: t } = await import(`../sender/${locale}.js`);

  return {
    subject: `${sellerName} ${t['Order Confirmation']}`,
    body: emailHtml(t, `
    <p>${t['Hello']},</p>
    <p>
      ${t['Thank you for shopping at']}&nbsp;${sellerName}
    </p>
    <p>
      ${t['Order :']}&nbsp;${order.order_number}
    </p>
    <p>
      ${t['Payment :']}&nbsp;${paymentMethod}
    </p>
    <p>
      ${t['Delivery :']}&nbsp;${deliveryAddress}
    </p>
    <p>
      ${t['Please find the summary of your order and your invoice attached.']}
    </p>
    <p>
      ${t['See you soon']},
      <br>
      ${t['The Live Pro Shop Team']}
    </p>`)
  };
};
