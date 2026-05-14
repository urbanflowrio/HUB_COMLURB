# Sistema de Componentes HUB COMLURB

Sistema modular e reutilizável para criar painéis de inteligência estratégica.

## 📦 Componentes Disponíveis

### 1. **hub-utils.js** - Utilitários Gerais
Funções auxiliares para formatação, manipulação de dados e helpers DOM.

```javascript
// Formatação
HUB.format.int(1234)           // "1.234"
HUB.format.pct(45.67)          // "45,7%"
HUB.format.calcPct(30, 100)    // 30
HUB.format.esc("<script>")     // "&lt;script&gt;"

// Manipulação de Arrays
HUB.array.unique(arr, "campo")      // Valores únicos
HUB.array.groupCount(arr, "campo")  // [[nome, count], ...]
HUB.array.avg(arr, "campo")         // Média
HUB.array.sum(arr, "campo")         // Soma

// DOM
HUB.dom.$("id")                // document.getElementById
HUB.dom.setText("id", "texto") // Define textContent
HUB.dom.setHTML("id", "<div>") // Define innerHTML
```

### 2. **hub-cards.js** - KPI Cards
Cards de métricas com visual executivo.

```javascript
HUB.cards.render("containerId", [
  {
    label: "Total de colaboradores",
    value: 1234,
    note: "No recorte atual",
    feature: true,  // Ocupa 2 colunas
    color: "green", // green|orange|red|purple|blue
    onclick: "minhaFuncao()",
    format: "int"   // int|pct|custom
  }
]);

// Templates prontos
HUB.cards.render("kpis", HUB.cards.templatePessoas({
  total: 1000,
  ativos: 800,
  afastados: 100,
  laudos: 50,
  risco65: 20
}));
```

### 3. **hub-charts.js** - Gráficos Chart.js
Gráficos pré-configurados com tema navy + glow.

```javascript
// Barra vertical
HUB.charts.bar("canvasId", {
  labels: ["A", "B", "C"],
  values: [10, 20, 30]
}, {
  label: "Distribuição",
  color: HUB.charts.colors.blueGradient,
  onclick: (label, value) => console.log(label, value)
});

// Rosca (donut)
HUB.charts.donut("canvasId", {
  labels: ["Ativos", "Afastados"],
  values: [800, 200]
});

// Linha
HUB.charts.line("canvasId", {
  labels: ["Jan", "Fev", "Mar"],
  values: [100, 150, 120]
});

// Barras simples (HTML puro, mais leve)
const data = HUB.array.groupCount(arr, "campo");
HUB.simpleBar.render("containerId", data, {
  total: arr.length,
  color: "green",
  onclick: name => `alert('${name}')`
});
```

### 4. **hub-filters.js** - Sistema de Filtros
Filtros cascata com localStorage automático.

```javascript
// Inicializa
HUB.filters.init();

// Popula select
HUB.filters.populate("selectId", ["Opção 1", "Opção 2"]);

// Popula todos baseado em dataset
HUB.filters.populateAll(data, [
  { id: "fDir", field: "diretoria" },
  { id: "fGer", field: "gerencia" }
]);

// Aplica filtros
const filtered = HUB.filters.apply(data, [
  { id: "fDir", field: "diretoria" },
  { 
    id: "fSituacao", 
    field: "ativo",
    matcher: (row, value) => value === "ativo" ? row.ativo : !row.ativo
  }
]);

// Callback para mudanças
HUB.filters.onChange(state => {
  console.log("Filtros mudaram:", state);
  renderAll();
});
```

### 5. **hub-layout.js** - Header, Footer e Layout
Componentes de layout e navegação.

```javascript
// Header
HUB.header.render("header", {
  systemLabel: "GESTÃO DE PESSOAS",
  title: "Painel Executivo",
  subtitle: "Análise da força de trabalho",
  status: {
    label: "REGISTROS",
    value: "1.234"
  },
  navigation: [
    { id: "screenVisao", label: "Visão Geral" },
    { id: "screenSaude", label: "Saúde Ocupacional" }
  ]
});

// Footer
HUB.footer.render("footer", {
  author: "Greicy Moreira",
  contact: "greicymoreira@comlurb.rio",
  version: "1.0",
  showTimestamp: true
});

// Banner de Drill Down
HUB.drillBanner.show("banner", {
  title: "Drill down: Diretoria X",
  description: "123 registros no recorte",
  onClear: "clearDrill()"
});

// Loading state
HUB.loading.show("containerId", "Carregando...");
HUB.loading.showMultiple(["chart1", "chart2", "chart3"]);
```

## 🚀 Como Usar

### 1. Estrutura HTML Base

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meu Painel</title>
  
  <!-- CSS do HUB -->
  <link rel="stylesheet" href="../assets/css/hub-premium.css">
</head>
<body>
  <div class="app">
    <!-- Header -->
    <div id="header"></div>
    
    <!-- Filtros -->
    <section class="filters">
      <div class="field">
        <label>Diretoria</label>
        <select id="fDir"><option value="">Todas</option></select>
      </div>
    </section>
    
    <!-- KPIs -->
    <div class="kpis" id="kpis"></div>
    
    <!-- Gráficos -->
    <div class="grid">
      <div class="panel">
        <div class="panelHead">
          <h2>Distribuição</h2>
          <div class="hint">Clique para filtrar</div>
        </div>
        <div class="body" id="chart1"></div>
      </div>
    </div>
    
    <!-- Footer -->
    <div id="footer"></div>
  </div>

  <!-- Dependências -->
  <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  
  <!-- Componentes HUB -->
  <script src="../assets/components/hub-utils.js"></script>
  <script src="../assets/components/hub-cards.js"></script>
  <script src="../assets/components/hub-charts.js"></script>
  <script src="../assets/components/hub-filters.js"></script>
  <script src="../assets/components/hub-layout.js"></script>
  
  <!-- Seu código -->
  <script src="app.js"></script>
</body>
</html>
```

### 2. JavaScript Base (app.js)

```javascript
let DATA = [];
let FILTERED = [];

async function init() {
  try {
    // Mostra loading
    HUB.loading.showMultiple(["kpis", "chart1"]);
    
    // Renderiza header
    HUB.header.render("header", {
      systemLabel: "MÓDULO",
      title: "Meu Painel",
      subtitle: "Descrição do painel"
    });
    
    // Carrega dados
    DATA = await HUB.data.loadCSV("URL_DO_GOOGLE_SHEETS", {
      name: "Minha Base",
      required: true
    });
    
    // Popula filtros
    HUB.filters.populateAll(DATA, [
      { id: "fDir", field: "diretoria" }
    ]);
    
    // Callback de mudança de filtros
    HUB.filters.onChange(() => render());
    
    // Renderiza
    render();
    
    // Renderiza footer
    HUB.footer.render("footer");
    
  } catch (e) {
    console.error("Erro ao carregar:", e);
    alert("Erro ao carregar dados");
  }
}

function render() {
  // Aplica filtros
  FILTERED = HUB.filters.apply(DATA, [
    { id: "fDir", field: "diretoria" }
  ]);
  
  // Renderiza KPIs
  HUB.cards.render("kpis", [
    { 
      label: "Total", 
      value: FILTERED.length, 
      feature: true 
    },
    { 
      label: "Ativos", 
      value: FILTERED.filter(r => r.ativo).length,
      color: "green"
    }
  ]);
  
  // Renderiza gráfico
  const grouped = HUB.array.groupCount(FILTERED, "diretoria").slice(0, 10);
  HUB.simpleBar.render("chart1", grouped, {
    total: FILTERED.length,
    color: "blue"
  });
}

// Inicializa quando DOM carregar
document.addEventListener("DOMContentLoaded", init);
```

## 📊 Criando Novo Painel

**Tempo estimado: 30 minutos**

1. Copie a estrutura HTML base
2. Defina URL do Google Sheets
3. Configure header, filtros e KPIs
4. Renderize gráficos com `HUB.simpleBar` ou `HUB.charts`
5. Pronto! 🎉

## 🎨 Classes CSS Disponíveis

### Layout
- `.app` - Container principal
- `.header` - Cabeçalho
- `.filters` - Barra de filtros
- `.kpis` - Grid de KPIs
- `.grid` - Grid 3 colunas
- `.grid2` - Grid 2 colunas
- `.panel` - Card de conteúdo

### KPIs
- `.kpi` - Card individual
- `.kpi.feature` - KPI destaque (2 cols)
- `.kpi.green|orange|red|purple` - Cores

### Gráficos
- `.barRow` - Linha de barra
- `.track` - Trilha da barra
- `.fill` - Preenchimento
- `.fill.green|orange|red` - Cores

## 🔧 Dicas

1. **Performance**: Use `HUB.simpleBar` para rankings simples (mais rápido que Chart.js)
2. **Cache**: `HUB.data.loadCSV` cacheia automaticamente
3. **Filtros**: Use `localStorage` automático com `HUB.filters`
4. **Drill Down**: Combine filtros + `HUB.drillBanner`
5. **Templates**: Use `HUB.cards.templatePessoas()` ou `.templateContratos()`

## 📝 Exemplo Completo

Ver `/pessoas/` para exemplo completo refatorado.
