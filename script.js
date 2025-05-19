function showForm(type) {
  const forms = {
    login: document.getElementById('login-form'),
    cadastro: document.getElementById('cadastro-form')
  };
  const tabs = document.querySelectorAll('.tab');

  Object.keys(forms).forEach(key => {
    forms[key].classList.toggle('active', key === type);
    tabs[key === 'login' ? 0 : 1].classList.toggle('active', key === type);
  });
}
