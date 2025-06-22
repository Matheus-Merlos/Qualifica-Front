import Logo from "../Logo";
import "./styles.css"

export default function Login() {
  function showForm(type) {
    const forms = {
      login: document.getElementById('login-form'),
      cadastro: document.getElementById('cadastro-form')
    };
    const tabs = document.querySelectorAll(`.tab`);

    Object.keys(forms).forEach(key => {
      forms[key].classList.toggle("active", key === type);
      tabs[key === 'login' ? 0 : 1].classList.toggle("active", key === type);
    });
  }

  return (
    <div className="container">
      <div className="logo-container">
        <Logo color='fff'/>
      </div>
      <div className="form-box">
        <div className="logo-card">
          <Logo color='#2c2c2c'/>
        </div>

        <div className="tab-buttons">
          <button className="tab active" onClick={() => showForm('login')}>Login</button>
          <button className="tab" onClick={() => showForm('cadastro')}>Cadastro</button>
        </div>

        <form id="login-form" className={`form active`}>
          <label htmlFor="login-email">Seu e-mail</label>
          <input type="email" id="login-email" required />

          <label htmlFor="login-password">Sua senha</label>
          <input type="password" id="login-password" required />

          <label className="checkbox">
            <input type="checkbox" className="input-checkbox" /> Lembrar meu login
          </label>

          <button type="submit">Entrar</button>

          <div className="social-buttons">
            <button className="google">
              <img src="/google.png" alt="Google" /> Entrar com Google
            </button>
            <button type="button" className="apple">
              <img src="/apple.png" alt="Apple" /> Entrar com Apple
            </button>
          </div>
        </form>

        <form id="cadastro-form" className={`form`}>
          <label htmlFor="cadastro-email">Seu e-mail</label>
          <input type="email" id="cadastro-email" required />

          <label htmlFor="cadastro-password">Sua senha</label>
          <input type="password" id="cadastro-password" required />

          <label htmlFor="cadastro-confirm-password">Confirmar senha</label>
          <input type="password" id="cadastro-confirm-password" required />

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}
