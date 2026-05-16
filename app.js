// ============================================
// APP.JS - PAINEL DTE
// Lógica principal do painel
// ============================================

// ============================================
// CONFIGURAÇÃO
// ============================================

const CONFIG = {
  panelName: "Painel Estratégico DTE",
  systemLabel: "DIRETORIA TÉCNICA E DE ENGENHARIA",
  subtitle: "Monitoramento Operacional e Análise de Performance"
};

// ============================================
// ESTADO GLOBAL
// ============================================

let DRILL = null;

// ============================================
// INICIALIZAÇÃO
// ============================================

async function init() {
  try {
    // Mostra loading
    HUB.loading.showMultiple([
      "kpis", 
      "chartEvolucao", 
      "chartETRs", 
      "chartTipoColeta",
      "chartSazonalidade",
      "chartUtilizacao",
      "chartBiogas",
      "chartFrota"
    ]);
    
    // Renderiza header
    HUB.header.render("header", {
      systemLabel: CONFIG.systemLabel,
      title: CONFIG.panelName,
      subtitle: CONFIG.subtitle
    });
    
    // Carrega dados do Google Sheets (SEM CACHE - sempre atualizado)
    const response = await fetch(DATA_URL, { 
      cache: "no-store",
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    const text = await response.text();
    
    const parsed = Papa.parse(text, {
      header: false,
      skipEmptyLines: true
    });
    
    DATA_RAW = parsed.data;
    processData();
    
    // Popula filtros
    populateFilters();
    
    // Callback de mudança
    HUB.filters.onChange(() => render());
    
    // Renderiza inicial
    render();
    
    // Footer - Padrão institucional HUB COMLURB
    HUB.footer.render("footer", {
      customText: `
        <strong>Gabinete da Presidência</strong><br>
        HUB COMLURB • Núcleo de Inteligência e Gestão Estratégica Operacional
      `,
      version: "1.0",
      showTimestamp: true
    });
    
  } catch (e) {
    console.error("Erro ao inicializar:", e);
    alert(`Erro ao carregar dados: ${e.message}`);
  }
}

// ============================================
// PROCESSAMENTO DE DADOS
// ============================================

function processData() {
  // Processa Recebimento ETRs
  const recIdx = findSection("I - Recebimento Resíduos Totais");
  if (recIdx !== -1) {
    const meses = DATA_RAW[recIdx].slice(1);
    const bangu = DATA_RAW[recIdx + 1];
    const caju = DATA_RAW[recIdx + 2];
    const jac = DATA_RAW[recIdx + 3];
    const hermes = DATA_RAW[recIdx + 4];
    const santa = DATA_RAW[recIdx + 5];
    const total = DATA_RAW[recIdx + 6];
    
    for (let i = 0; i < meses.length; i++) {
      DATA.recebimento.push({
        mes: meses[i],
        bangu: parseNum(bangu[i + 1]),
        caju: parseNum(caju[i + 1]),
        jacarepagua: parseNum(jac[i + 1]),
        hermes: parseNum(hermes[i + 1]),
        santa_cruz: parseNum(santa[i + 1]),
        total: parseNum(total[i + 1])
      });
    }
  }
  
  // Processa Tipo de Coleta
  const tipoIdx = findSection("II - Recebimento Residos Recebidos nas ETR");
  if (tipoIdx !== -1) {
    const meses = DATA_RAW[tipoIdx].slice(1);
    const domiciliar = DATA_RAW[tipoIdx + 1];
    const comunidades = DATA_RAW[tipoIdx + 2];
    const publico = DATA_RAW[tipoIdx + 3];
    const geradores = DATA_RAW[tipoIdx + 4];
    
    for (let i = 0; i < meses.length; i++) {
      DATA.tipoColeta.push({
        mes: meses[i],
        domiciliar: parseNum(domiciliar[i + 1]),
        comunidades: parseNum(comunidades[i + 1]),
        publico: parseNum(publico[i + 1]),
        geradores: parseNum(geradores[i + 1])
      });
    }
  }
  
  // Processa Biogás
  const bioIdx = findSection("V - Geração Biogás");
  if (bioIdx !== -1) {
    const meses = DATA_RAW[bioIdx].slice(1);
    const seropedica = DATA_RAW[bioIdx + 1];
    const gramacho = DATA_RAW[bioIdx + 2];
    
    for (let i = 0; i < meses.length; i++) {
      DATA.biogas.push({
        mes: meses[i],
        seropedica: parseNum(seropedica[i + 1]),
        gramacho: parseNum(gramacho[i + 1])
      });
    }
  }
  
  // Processa Utilização de Frota
  const utilIdx = findSection("Coleta Domiociliar e Comunidade");
  if (utilIdx !== -1) {
    const meses = DATA_RAW[utilIdx].slice(1);
    const taxa = DATA_RAW[utilIdx + 1];
    
    for (let i = 0; i < meses.length; i++) {
      const valor = taxa[i + 1];
      const pct = parseFloat(String(valor).replace("%", "").replace(",", "."));
      
      DATA.utilizacao.push({
        mes: meses[i],
        taxa: pct || 0
      });
    }
  }
  
  // Processa Frota Própria
  const frotaIdx = findSection("C - MANUTENÇÃO FROTA PRÓPRIA");
  if (frotaIdx !== -1) {
    const meses = DATA_RAW[frotaIdx].slice(1);
    const total = DATA_RAW[frotaIdx + 1];
    const operacao = DATA_RAW[frotaIdx + 7];
    const diesel = DATA_RAW[frotaIdx + 11];
    
    for (let i = 0; i < meses.length; i++) {
      DATA.frotaPropria.push({
        mes: meses[i],
        total: parseNum(total[i + 1]),
        operacao: parseNum(operacao[i + 1]),
        diesel: parseNum(diesel[i + 1])
      });
    }
  }
  
  console.log("✅ Dados processados:", DATA);
}

// ============================================
// FILTROS
// ============================================

function populateFilters() {
  // Popula ETRs
  const etrs = ["Bangu", "Caju", "Jacarepaguá", "Mal Hermes", "Santa Cruz"];
  HUB.filters.populate("fETR", etrs);
  
  // Popula Tipos
  const tipos = ["Coleta Domiciliar", "Coleta em Comunidades", "Lixo Público", "Grandes Geradores"];
  HUB.filters.populate("fTipo", tipos);
}

function clearAll() {
  HUB.filters.clear();
  DRILL = null;
  HUB.drillBanner.hide("drillBanner");
  render();
}

// ============================================
// DRILL DOWN
// ============================================

function setDrill(field, value, label) {
  DRILL = { field, value, label };
  
  HUB.drillBanner.show("drillBanner", {
    title: `Filtro ativo: ${label}`,
    description: "Clique para remover",
    onClear: "clearDrill()"
  });
  
  render();
}

function clearDrill() {
  DRILL = null;
  HUB.drillBanner.hide("drillBanner");
  render();
}

// ============================================
// RENDERIZAÇÃO
// ============================================

function render() {
  renderKPIs();
  renderCharts();
}

function renderKPIs() {
  if (!DATA.recebimento.length) return;
  
  const ultimo = DATA.recebimento[DATA.recebimento.length - 1];
  const penultimo = DATA.recebimento[DATA.recebimento.length - 2];
  const variacao = ((ultimo.total - penultimo.total) / penultimo.total * 100);
  
  const media = DATA.recebimento.reduce((acc, r) => acc + r.total, 0) / DATA.recebimento.length;
  const pico = Math.max(...DATA.recebimento.map(r => r.total));
  
  // Últimas médias de frota
  const ultimaUtil = DATA.utilizacao.length ? DATA.utilizacao[DATA.utilizacao.length - 1].taxa : 0;
  
  // Última frota própria
  const ultimaFrota = DATA.frotaPropria.length ? DATA.frotaPropria[DATA.frotaPropria.length - 1] : { total: 0, operacao: 0 };
  
  HUB.cards.render("kpis", [
    {
      label: "Recebimento Total",
      value: ultimo.total,
      note: `${ultimo.mes} • ${variacao > 0 ? '+' : ''}${HUB.format.pct(variacao, 1)} vs mês anterior`,
      feature: true,
      format: "int",
      color: variacao > 0 ? "orange" : "green"
    },
    {
      label: "ETR Caju (Líder)",
      value: ultimo.caju,
      note: `${HUB.format.pct((ultimo.caju / ultimo.total) * 100)} do total`,
      format: "int",
      color: "blue",
      onclick: "setDrill('etr', 'Caju', 'ETR Caju')"
    },
    {
      label: "Média Mensal",
      value: media,
      note: "Últimos 13 meses",
      format: "int",
      color: "green"
    },
    {
      label: "Utilização Frota CDC",
      value: ultimaUtil,
      note: "Peso / capacidade estimada",
      format: "pct",
      color: ultimaUtil > 75 ? "green" : "orange"
    },
    {
      label: "Frota Própria Ativa",
      value: ultimaFrota.operacao,
      note: `${ultimaFrota.total} total • ${HUB.format.pct((ultimaFrota.operacao / ultimaFrota.total) * 100, 0)} operacional`,
      format: "int",
      color: "purple"
    }
  ]);
}

function renderCharts() {
  if (!DATA.recebimento.length) return;
  
  // Gráfico: Evolução do Recebimento
  HUB.charts.line("chartEvolucao", {
    labels: DATA.recebimento.map(r => r.mes),
    values: DATA.recebimento.map(r => r.total)
  }, {
    label: "Recebimento Total (t)",
    color: HUB.charts.colors.blueGradient
  });
  
  // Ranking ETRs
  const ultimo = DATA.recebimento[DATA.recebimento.length - 1];
  const etrsData = [
    ["ETR Caju", ultimo.caju],
    ["ETR Mal Hermes", ultimo.hermes],
    ["ETR Bangu", ultimo.bangu],
    ["ETR Jacarepaguá", ultimo.jacarepagua],
    ["ETR Santa Cruz", ultimo.santa_cruz]
  ].sort((a, b) => b[1] - a[1]);
  
  HUB.simpleBar.render("chartETRs", etrsData, {
    total: ultimo.total,
    color: "blue",
    onclick: name => `setDrill('etr', '${name}', '${name}')`
  });
  
  // Tipo de Coleta
  if (DATA.tipoColeta.length) {
    const ultimoTipo = DATA.tipoColeta[DATA.tipoColeta.length - 1];
    HUB.charts.donut("chartTipoColeta", {
      labels: ["Domiciliar", "Comunidades", "Lixo Público", "Grandes Geradores"],
      values: [
        ultimoTipo.domiciliar,
        ultimoTipo.comunidades,
        ultimoTipo.publico,
        ultimoTipo.geradores
      ]
    });
  }
  
  // Sazonalidade
  const mesesAgrupados = {};
  DATA.recebimento.forEach(r => {
    const mes = r.mes.split("-")[0];
    if (!mesesAgrupados[mes]) mesesAgrupados[mes] = [];
    mesesAgrupados[mes].push(r.total);
  });
  
  const sazonalidade = Object.entries(mesesAgrupados).map(([mes, valores]) => {
    const media = valores.reduce((a, b) => a + b, 0) / valores.length;
    return [mes, media];
  });
  
  const mediaSaz = sazonalidade.reduce((a, b) => a + b[1], 0) / sazonalidade.length;
  HUB.simpleBar.render("chartSazonalidade", sazonalidade, {
    total: mediaSaz,
    color: "green"
  });
  
  // Utilização Frota
  if (DATA.utilizacao.length) {
    HUB.charts.line("chartUtilizacao", {
      labels: DATA.utilizacao.map(r => r.mes),
      values: DATA.utilizacao.map(r => r.taxa)
    }, {
      label: "Taxa de Utilização (%)",
      color: HUB.charts.colors.orangeGradient
    });
  }
  
  // Biogás
  if (DATA.biogas.length) {
    const ctx = document.getElementById("chartBiogas").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: DATA.biogas.map(r => r.mes),
        datasets: [
          {
            label: "CTR Seropédica",
            data: DATA.biogas.map(r => r.seropedica / 1000),
            borderColor: "#78aaa3",
            backgroundColor: "rgba(120, 170, 163, 0.1)",
            borderWidth: 3,
            tension: 0.4,
            fill: true
          },
          {
            label: "Aterro Gramacho",
            data: DATA.biogas.map(r => r.gramacho / 1000),
            borderColor: "#5b9bd5",
            backgroundColor: "rgba(91, 155, 213, 0.1)",
            borderWidth: 3,
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#b8c9de",
              font: { size: 12 },
              padding: 15,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: "rgba(13,31,54,0.95)",
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${HUB.format.int(ctx.parsed.y)} mil Nm³`
            }
          }
        },
        scales: {
          y: {
            grid: { color: "rgba(41,72,102,0.3)" },
            ticks: {
              color: "#b8c9de",
              callback: value => `${value}k`
            }
          },
          x: {
            grid: { color: "rgba(41,72,102,0.3)" },
            ticks: { color: "#b8c9de" }
          }
        }
      }
    });
  }
  
  // Frota Própria
  if (DATA.frotaPropria.length) {
    const ctx = document.getElementById("chartFrota").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: DATA.frotaPropria.map(r => r.mes),
        datasets: [
          {
            label: "Frota Total",
            data: DATA.frotaPropria.map(r => r.total),
            borderColor: "#ef6a5d",
            backgroundColor: "rgba(239, 106, 93, 0.1)",
            borderWidth: 3,
            tension: 0.4,
            fill: true
          },
          {
            label: "Em Operação",
            data: DATA.frotaPropria.map(r => r.operacao),
            borderColor: "#78aaa3",
            backgroundColor: "rgba(120, 170, 163, 0.1)",
            borderWidth: 3,
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#b8c9de",
              font: { size: 12 },
              padding: 15,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: "rgba(13,31,54,0.95)",
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y} veículos`
            }
          }
        },
        scales: {
          y: {
            grid: { color: "rgba(41,72,102,0.3)" },
            ticks: {
              color: "#b8c9de",
              callback: value => value
            }
          },
          x: {
            grid: { color: "rgba(41,72,102,0.3)" },
            ticks: { color: "#b8c9de" }
          }
        }
      }
    });
  }
}

// ============================================
// BOOT
// ============================================

document.addEventListener("DOMContentLoaded", init);
