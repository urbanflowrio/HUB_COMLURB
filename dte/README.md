# Painel DTE - Diretoria Técnica e de Engenharia

Sistema de monitoramento operacional da DTE integrado ao HUB COMLURB.

## 📊 Visão Geral

Este painel consolida dados operacionais mensais das seguintes áreas:

### **A - Atividades Operacionais**
- Recebimento de resíduos nas 5 ETRs (Bangu, Caju, Jacarepaguá, Mal Hermes, Santa Cruz)
- Distribuição por tipo de coleta (Domiciliar, Comunidades, Lixo Público, Grandes Geradores)
- Operação Bem Verde
- Aterro de RCC Gericinó

### **B - Monitoramento de Frota Contratada**
- Taxa de utilização por tipo de veículo
- Análise de sobrecarga (>10% PBT)
- Gerências ofensoras
- Horas extras vs faturamento
- Utilização de tratores

### **C - Bioenergia & Sustentabilidade**
- Geração de biogás (CTR Seropédica + Aterro Gramacho)
- Biogás para purificação
- Produção de chorume

### **D - Infraestrutura**
- Frota própria (evolução total vs operacional)
- Consumo de diesel e lubrificantes
- Intervenções prediais

## 🎯 KPIs Principais

1. **Recebimento Total** - Volume mensal nas ETRs (~253 mil toneladas/mês)
2. **ETR Caju (Líder)** - Principal unidade de recebimento (~40% do total)
3. **Média Mensal** - Baseline dos últimos 13 meses
4. **Utilização Frota CDC** - Taxa de aproveitamento da capacidade (70-85%)
5. **Frota Própria Ativa** - Veículos em operação vs total

## 📈 Insights Estratégicos

### **Gestão de Resíduos**
- **~253 mil toneladas/mês** de recebimento total
- **Sazonalidade clara**: picos em dezembro-janeiro (verão carioca)
- **ETR Caju** concentra 40% do volume
- **Coleta Domiciliar** representa 50% do total

### **Performance de Frota**
- Taxa de utilização: **70-85%** conforme tipo de serviço
- **20-30% das pesagens** excedem 10% do PBT (sobrecarga)
- Horas extras variam entre **0,8-2,3%** do faturamento
- Sistema de **benchmarking** identifica gerências ofensoras mensalmente

### **Bioenergia**
- Geração de **~16 milhões de Nm³** de biogás/mês
- **67% de taxa de purificação** (CTR Seropédica)
- Aterro Gramacho contribui com ~3% do total

### **Infraestrutura**
- **Redução crítica**: 177 → 74 veículos próprios (-58%)
- Taxa operacional: **~19%** (14 de 74 veículos ativos)
- Consumo otimizado: **~2.000L diesel/mês**
- **60-115 intervenções prediais/mês**

## 🔄 Atualização Automática Mensal

### **Como Funciona:**

1. **Planilha Google Sheets** é atualizada mensalmente pela DTE
2. **URL publicada como CSV** permanece a mesma
3. **Painel lê automaticamente** os dados mais recentes toda vez que é carregado
4. **Sem necessidade de atualizar código** - apenas a planilha

### **URL da Planilha:**
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vTRbfRYtnjYlxLIPTfIpC_Q7ftJ6uUf1BK9gcZs_CSEiEnIE7qCAk_U_3_bibXftsCAf5K1uQdAPsOx/pub?output=csv
```

### **Configuração no código:**
```javascript
// Em data.js
const DATA_URL = "URL_DA_PLANILHA/pub?output=csv";

// Em app.js - fetch SEM cache
const response = await fetch(DATA_URL, { 
  cache: "no-store",
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
});
```

## 🚀 Arquitetura Técnica

### **Estrutura de Arquivos**
```
/hub-comlurb/
├── assets/
│   ├── css/
│   │   └── hub-premium.css          ← CSS compartilhado
│   ├── components/
│   │   ├── hub-utils.js             ← Utilitários
│   │   ├── hub-cards.js             ← KPIs
│   │   ├── hub-charts.js            ← Gráficos
│   │   ├── hub-filters.js           ← Filtros
│   │   └── hub-layout.js            ← Header/Footer
│   └── logo.png                     ← Logo COMLURB
│
└── dte/                              ← PAINEL DTE
    ├── index.html                    ← Estrutura HTML
    ├── data.js                       ← URL e metadados
    ├── app.js                        ← Lógica de renderização
    └── README.md                     ← Este arquivo
```

### **Fonte de Dados**
- **Origem**: Google Sheets (planilha DTE atualizada mensalmente)
- **Formato**: CSV publicado
- **Atualização**: Automática (sem cache, sempre dados frescos)
- **Processamento**: Parse via PapaParse + estruturação por seções

### **Componentes HUB Utilizados**

✅ `HUB.loading.showMultiple()` - Estados de carregamento  
✅ `HUB.header.render()` - Header com título e navegação  
✅ `HUB.footer.render()` - Footer institucional padronizado  
✅ `HUB.cards.render()` - Grid de KPIs  
✅ `HUB.charts.line()` - Gráficos de linha  
✅ `HUB.charts.donut()` - Gráficos de rosca  
✅ `HUB.simpleBar.render()` - Rankings com barras HTML  
✅ `HUB.filters.populate()` - Sistema de filtros  
✅ `HUB.drillBanner.show()` - Banner de drill-down  
✅ `HUB.format.*` - Formatação de números e percentuais

## 🔧 Como Usar

### **1. Estrutura de Pastas**

Certifique-se de ter a estrutura correta:

```
/hub-comlurb/
├── assets/
│   ├── css/
│   │   └── hub-premium.css
│   ├── components/
│   │   ├── hub-utils.js
│   │   ├── hub-cards.js
│   │   ├── hub-charts.js
│   │   ├── hub-filters.js
│   │   └── hub-layout.js
│   └── logo.png
│
└── dte/
    ├── index.html
    ├── data.js
    ├── app.js
    └── README.md
```

### **2. Abrir o Painel**

Navegue até: `http://seu-servidor/hub-comlurb/dte/index.html`

Ou abra `index.html` diretamente no navegador (funciona localmente).

### **3. Atualização Mensal**

**IMPORTANTE:** Você **NÃO precisa mexer no código** para atualizar os dados!

1. Atualize a planilha Google Sheets mensalmente
2. Mantenha a mesma estrutura de seções e cabeçalhos
3. O painel lerá automaticamente os novos dados

### **4. Personalização**

**Adicionar novo KPI:**
```javascript
// Em app.js > renderKPIs()
{
  label: "Novo KPI",
  value: calculoDoValor,
  note: "Descrição",
  format: "int",
  color: "green"
}
```

**Adicionar novo gráfico:**
```javascript
// Em app.js > renderCharts()
HUB.charts.bar("novoChart", {
  labels: [...],
  values: [...]
});
```

**Adicionar filtro:**
```html
<!-- Em index.html -->
<div class="field">
  <label>Novo Filtro</label>
  <select id="fNovoFiltro">
    <option value="">Todos</option>
  </select>
</div>
```

```javascript
// Em app.js > populateFilters()
HUB.filters.populate("fNovoFiltro", valores);
```

## 📊 Estrutura da Planilha

**IMPORTANTE:** Manter esta estrutura para o painel funcionar corretamente:

```
DIRETORIA TÉCNICA E DE ENGENHARIA - DTE 
A - ATIVIDADES OPERACIONAIS
I - Recebimento Resíduos Totais - t | abr-25 | mai-25 | jun-25 ...
ETR Bangu - t                        | 46.155 | 48.998 | ...
ETR Caju - t                         | 92.326 | 95.340 | ...
ETR Jacarepagua - t                  | 42.320 | 42.356 | ...
ETR Mal Hermes - t                   | 48.660 | 49.226 | ...
ETR Santa Cruz - t                   | 17.850 | 18.313 | ...
ETR Total -t                         | 247.311 | 254.233 | ...

II - Recebimento Residos Recebidos nas ETR's - Por Tipo
Coleta Domiciliar - t                | 116.027 | 116.797 | ...
Coleta em Comunidades - t            | 12.901 | 12.653 | ...
Lixo Público - t                     | 86.896 | 90.185 | ...
Grande Geradores (COMLURB) - t       | 25.963 | 27.809 | ...

V - Geração Biogás (Nm³)
CTR Seriopédica                      | 15.147.384 | ...
Aterro Gramacho                      | 504.312 | ...

...
```

**Regras:**
- ✅ Manter cabeçalhos das seções (I -, II -, V -, etc)
- ✅ Primeira linha de cada seção: meses (abr-25, mai-25, etc)
- ✅ Usar vírgula para decimais (46,155 ou 46.155)
- ✅ Não alterar nome das ETRs e tipos de coleta

## 🎨 Customização Visual

### **Cores dos KPIs**
```javascript
color: "green"   // Verde (#78aaa3)
color: "orange"  // Laranja (#e87535)
color: "red"     // Vermelho (#ef6a5d)
color: "blue"    // Azul (#5b9bd5)
color: "purple"  // Roxo (#a78bfa)
```

### **Cores dos Gráficos**
```javascript
HUB.charts.colors.blueGradient
HUB.charts.colors.orangeGradient
HUB.charts.colors.greenGradient
HUB.charts.colors.redGradient
HUB.charts.colors.purpleGradient
```

## 🔍 Funcionalidades

- ✅ **Atualização automática mensal** (lê sempre dados frescos do Google Sheets)
- ✅ **Filtros dinâmicos** (Período, ETR, Tipo de Serviço)
- ✅ **Drill-down interativo** (clique nas barras para filtrar)
- ✅ **Responsivo** (mobile/tablet/desktop)
- ✅ **Sistema de componentes reutilizáveis** (HUB COMLURB)
- ✅ **Footer institucional padronizado**

## 📝 Melhorias Futuras

1. **Adicionar telas de navegação** (Tabs para cada seção A, B, C, D)
2. **Drill-down por gerência ofensora**
3. **Alertas automáticos** (sobrecarga > 30%, HE > 2%)
4. **Comparativo ano anterior** (2024 vs 2025)
5. **Exportação para PDF/Excel**
6. **Mapa geográfico das ETRs** (Leaflet.js)
7. **Dashboard de anomalias** (detecção automática de outliers)

## 👥 Créditos

**Gabinete da Presidência**  
HUB COMLURB • Núcleo de Inteligência e Gestão Estratégica Operacional  
Versão 1.0 - Maio 2025

---

## 📞 Suporte

Para dúvidas ou sugestões sobre o painel:
- Contate o Núcleo de Inteligência e Gestão Estratégica Operacional
- Verifique a documentação dos componentes HUB em `/assets/components/`
