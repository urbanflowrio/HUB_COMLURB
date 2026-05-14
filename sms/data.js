/**
 * SMS DATA MODULE
 * Carregamento e processamento de dados do contrato de limpeza hospitalar
 */

const SMSData = {
  // URLs dos CSVs públicos
  urls: {
    faturamento: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQr5S1R56YvP2uYOVJorK3b5CxUghxDNyZu6V6t7Kq_hoxJoj4zrTQVh77NGZPm_IdrBT_xwIU3pca9/pub?gid=24719560&single=true&output=csv",
    containers: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQr5S1R56YvP2uYOVJorK3b5CxUghxDNyZu6V6t7Kq_hoxJoj4zrTQVh77NGZPm_IdrBT_xwIU3pca9/pub?output=csv"
  },

  // Estrutura base dos hospitais
  hospitais: [
    {
      id: "miguel_couto",
      nome: "Hospital Municipal Miguel Couto",
      sigla: "HM Miguel Couto",
      receitaMensal: 1260796,
      garis: 111,
      lat: -22.9856,
      lng: -43.2009,
      vencimento: "01/01/2028",
      reajuste: "Bienal",
      status: "Ativo"
    },
    {
      id: "salgado_filho",
      nome: "Hospital Municipal Salgado Filho",
      sigla: "HM Salgado Filho",
      receitaMensal: 1201051,
      garis: 106,
      lat: -22.8897,
      lng: -43.2827,
      vencimento: "01/01/2028",
      reajuste: "Bienal",
      status: "Ativo"
    },
    {
      id: "lourenzo_jorge",
      nome: "Hospital Municipal Lourenço Jorge / Maternidade Leila Diniz",
      sigla: "HM Lourenço Jorge",
      receitaMensal: 1576412,
      garis: 145,
      lat: -22.9749,
      lng: -43.3654,
      vencimento: "01/01/2028",
      reajuste: "Bienal",
      status: "Ativo"
    },
    {
      id: "leila_diniz",
      nome: "Maternidade Leila Diniz",
      sigla: "Maternidade Leila Diniz",
      receitaMensal: 0, // Incluída no Lourenço Jorge
      garis: 0,
      lat: -22.9147,
      lng: -43.2303,
      vencimento: "01/01/2028",
      reajuste: "Bienal",
      status: "Ativo (vinculada ao HM Lourenço Jorge)"
    }
  ],

  // Storage
  faturamento: [],
  containers: [],
  loaded: false,

  /**
   * Carrega todos os dados
   */
  async load() {
    try {
      console.log("🏥 Carregando dados do SMS...");

      // Carrega faturamento
      try {
        const fatData = await HUB.utils.loadCSV(this.urls.faturamento, "sms_faturamento");
        this.faturamento = fatData.filter(row => {
          return row.ANO && row.MES && (
            row["HOSPITAL MUNICIPAL LOURENÇO JORGE/MATERNIDADE LEILA DINIZ"] ||
            row["HOSPITAL MUNICIPAL MIGUEL COUTO"] ||
            row["HOSPITAL MUNICIPAL RONALDO GAZOLLA"] ||
            row["HOSPITAL MUNICIPAL SALGADO FILHO"]
          );
        });
        console.log("✅ Faturamento carregado:", this.faturamento.length, "registros");
      } catch (err) {
        console.warn("⚠️ Erro ao carregar faturamento:", err);
        this.faturamento = [];
      }

      // Carrega containers
      try {
        const contData = await HUB.utils.loadCSV(this.urls.containers, "sms_containers");
        this.containers = contData.filter(row => row.HOSPITAL && row.TOTAL);
        console.log("✅ Containers carregados:", this.containers.length, "registros");
      } catch (err) {
        console.warn("⚠️ Erro ao carregar containers:", err);
        this.containers = [];
      }

      // Enriquece hospitais com dados de containers
      this.enrichHospitals();

      this.loaded = true;
      console.log("✅ SMS Data carregado com sucesso!");
      return true;

    } catch (error) {
      console.error("❌ Erro ao carregar dados do SMS:", error);
      throw error;
    }
  },

  /**
   * Enriquece dados dos hospitais com containers
   */
  enrichHospitals() {
    if (this.containers.length === 0) return;

    this.hospitais.forEach(hospital => {
      const containerData = this.containers.find(c => 
        c.HOSPITAL && c.HOSPITAL.toLowerCase().includes(hospital.sigla.toLowerCase().split(" ")[2])
      );

      if (containerData) {
        hospital.containersTotal = parseInt(containerData.TOTAL) || 0;
        hospital.containersRSS = parseInt(containerData.RSS) || 0;
      } else {
        hospital.containersTotal = 0;
        hospital.containersRSS = 0;
      }
    });
  },

  /**
   * Retorna hospitais ativos (sem Gazolla)
   */
  getHospitaisAtivos() {
    return this.hospitais.filter(h => h.status === "Ativo" && h.receitaMensal > 0);
  },

  /**
   * Calcula totais do contrato
   */
  getTotais() {
    const ativos = this.getHospitaisAtivos();
    
    return {
      hospitais: ativos.length,
      garis: ativos.reduce((sum, h) => sum + h.garis, 0),
      receitaMensal: ativos.reduce((sum, h) => sum + h.receitaMensal, 0),
      containersTotal: ativos.reduce((sum, h) => sum + (h.containersTotal || 0), 0),
      containersRSS: ativos.reduce((sum, h) => sum + (h.containersRSS || 0), 0)
    };
  },

  /**
   * Calcula faturamento acumulado
   */
  getFaturamentoAcumulado() {
    let total = 0;

    this.faturamento.forEach(row => {
      ["HOSPITAL MUNICIPAL LOURENÇO JORGE/MATERNIDADE LEILA DINIZ",
       "HOSPITAL MUNICIPAL MIGUEL COUTO",
       "HOSPITAL MUNICIPAL RONALDO GAZOLLA",
       "HOSPITAL MUNICIPAL SALGADO FILHO"].forEach(col => {
        const val = parseFloat(row[col]);
        if (!isNaN(val)) total += val;
      });
    });

    return total;
  },

  /**
   * Retorna faturamento por hospital
   */
  getFaturamentoPorHospital() {
    const result = {
      "Lourenço Jorge": 0,
      "Miguel Couto": 0,
      "Ronaldo Gazolla": 0,
      "Salgado Filho": 0
    };

    this.faturamento.forEach(row => {
      const lj = parseFloat(row["HOSPITAL MUNICIPAL LOURENÇO JORGE/MATERNIDADE LEILA DINIZ"]);
      const mc = parseFloat(row["HOSPITAL MUNICIPAL MIGUEL COUTO"]);
      const rg = parseFloat(row["HOSPITAL MUNICIPAL RONALDO GAZOLLA"]);
      const sf = parseFloat(row["HOSPITAL MUNICIPAL SALGADO FILHO"]);

      if (!isNaN(lj)) result["Lourenço Jorge"] += lj;
      if (!isNaN(mc)) result["Miguel Couto"] += mc;
      if (!isNaN(rg)) result["Ronaldo Gazolla"] += rg;
      if (!isNaN(sf)) result["Salgado Filho"] += sf;
    });

    return result;
  },

  /**
   * Retorna evolução mensal (últimos 12 meses)
   */
  getEvolucaoMensal() {
    const ultimos = this.faturamento.slice(-12);
    
    return ultimos.map(row => {
      const total = ["HOSPITAL MUNICIPAL LOURENÇO JORGE/MATERNIDADE LEILA DINIZ",
                     "HOSPITAL MUNICIPAL MIGUEL COUTO",
                     "HOSPITAL MUNICIPAL RONALDO GAZOLLA",
                     "HOSPITAL MUNICIPAL SALGADO FILHO"]
        .reduce((sum, col) => {
          const val = parseFloat(row[col]);
          return sum + (isNaN(val) ? 0 : val);
        }, 0);

      return {
        mes: `${row.MES}/${row.ANO}`,
        valor: total
      };
    });
  },

  /**
   * Retorna hospitais para o mapa
   */
  getHospitaisParaMapa() {
    return this.hospitais.map(h => ({
      nome: h.nome,
      sigla: h.sigla,
      lat: h.lat,
      lng: h.lng,
      garis: h.garis,
      receita: h.receitaMensal,
      containers: h.containersTotal || 0,
      containersRSS: h.containersRSS || 0,
      status: h.status
    }));
  }
};
