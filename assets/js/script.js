const apiKey = `at_jNLQYIanueylgMsqFyEW3vxR8ZebE`;

function checkDomain() {
  const domain = document.getElementById(`domainInput`).value.trim();
  if (!domain) {
    showModal(`Please enter a domain name.`);
    return;
  }

  fetch(
    `https://domain-availability.whoisxmlapi.com/api/v1?apiKey=${apiKey}&domainName=${domain}&credits=DA&outputFormat=JSON`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(
        `data.DomainInfo.domainAvailability: ` +
          data.DomainInfo.domainAvailability
      );
      if (data.DomainInfo.domainAvailability === `UNAVAILABLE`) {
        getRegistrantInfo(domain);
      } else {
        showModal(`Domain "${domain}" is available.`);
      }
    })
    .catch((error) => console.error(`Error:`, error));
}

function getRegistrantInfo(domain) {
  fetch(
    `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${apiKey}&domainName=${domain}&da=2&outputFormat=JSON`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(
        `data.WhoisRecord.administrativeContact.rawText: ` +
          data.WhoisRecord.administrativeContact.rawText
      );
      const registrantInfo = data?.WhoisRecord?.registrant;
      if (registrantInfo) {
        const info = `
          Domain: ${domain}<br>
          Registrant Name: ${registrantInfo.name}<br>
          Registrant Email: ${registrantInfo.email}<br>
          Registrant Phone: ${registrantInfo.telephone}
        `;
        showModal(info);
        saveToLocalStorage(domain, registrantInfo);
      } else {
        showModal(`Registrant information not available.`);
      }
    })
    .catch((error) => console.error(`Error:`, error));
}

function showModal(content) {
  const modal = document.getElementById(`domainInfoModal`);
  const domainInfo = document.getElementById(`domainInfo`);
  domainInfo.innerHTML = content;
  modal.classList.add(`is-active`);
}

function closeModal() {
  const modal = document.getElementById(`domainInfoModal`);
  modal.classList.remove(`is-active`);
  document.getElementById(`domainInput`).value = ``;
}

function saveToLocalStorage(domain, registrantInfo) {
  const domainData = {
    name: registrantInfo.name,
    email: registrantInfo.email,
    phone: registrantInfo.telephone,
  };
  localStorage.setItem(domain, JSON.stringify(domainData));
}
