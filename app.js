/**
 * SMS APP MODULE
 * Orquestração do painel SMS
 */

const SMSApp = {
  currentScreen: "exec",

  /**
   * Inicialização
   */
  async init() {
    console.log("🏥 Iniciando Painel SMS...");

    // Header
    HUB.layout.renderHeader("header", {
      logo: "../assets/logos/logo-comlurb.png",
      systemLabel: "GESTÃO DE CONTRATOS",
      title: "Limpeza e Higienização Hospitalar",
      subtitle: "Monitoramento operacional e financeiro do contrato SMS • Rede Municipal de Saúde"
    });

    // Navegação
    this.setupNavigation();

    // Loading
    document.getElementById("loading").style.display = "block";

    // Carrega dados
    try {
      await SMSData.load();
      
      // Renderiza tela inicial
      this.showScreen("exec");
      
      document.getElementById("loading").style.display = "none";
      
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      document.getElementById("loading").innerHTML = `
        <div style="color:#ef6a5d; padding:20px; text-align:center;">
          ⚠️ Erro ao carregar dados do SMS.<br>
          <small style="color:#aebfd5; margin-top:8px; display:block;">Verifique as fontes de dados ou tente novamente.</small>
        </div>
      `;
    }

    // Footer
    HUB.footer.render("footer", {
      customText: `
        <strong>Gabinete da Presidência</strong><br>
        HUB COMLURB • Núcleo de Inteligência e Gestão Estratégica Operacional
      `,
      version: "1.0",
      showTimestamp: false
    });
  },

  /**
   * Configurar navegação entre telas
   */
  setupNavigation() {
    const tabs = document.querySelectorAll(".tabBtn");
    
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const screen = tab.dataset.screen;
        this.showScreen(screen);
      });
    });
  },

  /**
   * Mostrar tela
   */
  showScreen(screenId) {
    // Atualiza abas
    document.querySelectorAll(".tabBtn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.screen === screenId);
    });

    // Esconde todas as telas
    document.querySelectorAll(".screen").forEach(s => {
      s.classList.remove("active");
    });

    // Mostra tela selecionada
    const screen = document.getElementById(`screen-${screenId}`);
    if (screen) {
      screen.classList.add("active");
      
      // Renderiza conteúdo da tela
      this.renderScreen(screenId);
    }

    this.currentScreen = screenId;
  },

  /**
   * Renderiza conteúdo da tela
   */
  renderScreen(screenId) {
    switch(screenId) {
      case "exec":
        SMSScreens.renderVisaoExecutiva();
        break;
      case "estrutura":
        SMSScreens.renderEstruturaContratual();
        break;
      case "territorial":
        SMSScreens.renderTerritorial();
        break;
    }
  }
};

// Auto-inicializa quando DOM carregar
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => SMSApp.init());
} else {
  SMSApp.init();
}
