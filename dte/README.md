# Painel DTE - Diretoria Técnica e de Engenharia

**VERSÃO COMPLETA** - 4 Telas | Drill-down | Filtros | Responsivo

## ✅ FUNCIONALIDADES IMPLEMENTADAS

### 📱 **Responsivo**
- Desktop (1800px+)
- Tablet (768px - 1280px)  
- Mobile (< 768px)

### 🎯 **4 Telas Estratégicas**

#### **TELA 1 - Visão Geral Operacional**
- 5 KPIs (Recebimento Total, ETR Caju, Média Mensal, Utilização Frota, Frota Ativa)
- Evolução do recebimento (linha)
- Ranking de ETRs (barras clicáveis - drill-down)
- Distribuição por tipo de coleta (pizza)
- Sazonalidade mensal (barras)
- Operação Bem Verde (barras)

#### **TELA 2 - Performance de Frota**
- 5 KPIs (Utilização CDC, Sobrecarga, Horas Extras, Média, Meta)
- Taxa de utilização por tipo de veículo (barras)
- Evolução de horas extras (linha)
- Top 3 gerências ofensoras (barras)
- Sobrecarga de veículos (barras)
- Utilização de tratores (barras)

#### **TELA 3 - Bioenergia & Sustentabilidade**
- 5 KPIs (Biogás Total, CTR, Gramacho, Chorume, Purificação)
- Geração de biogás (linha dupla CTR + Gramacho)
- Distribuição CTR vs Gramacho (pizza)
- Produção de chorume (barras empilhadas)
- Biogás para purificação (linha)
- Aterro de RCC Gericinó (barras)

#### **TELA 4 - Infraestrutura**
- 5 KPIs (Redução, Operação, Diesel, Intervenções, Taxa)
- Evolução da frota própria (linha dupla total + operação)
- Consumo de diesel (barras)
- Intervenções prediais (linha)
- Consumo de lubrificantes (barras)
- Tipos de intervenções (pizza)

**TOTAL: 20 KPIs + 24 Gráficos = 44 Visualizações**

### 🔍 **Drill-Down Completo**
- Clique em barras de ETRs para filtrar
- Banner mostrando filtro ativo
- Botão "Limpar" para remover filtro
- Estado de drill-down persiste entre telas

### 📅 **Seletor de Período**
- Todos os dados
- Últimos 3 meses
- Últimos 6 meses
- Últimos 12 meses
- Aplica filtro em todas as visualizações

### 🎨 **Filtros Dinâmicos**
- Por ETR (Bangu, Caju, Jacarepaguá, Mal Hermes, Santa Cruz)
- Por Tipo de Coleta (Domiciliar, Comunidades, Lixo Público, Grandes Geradores)
- Por Período
- Botão "Limpar" reseta todos os filtros

### 🔄 **Atualização Automática Mensal**
- Lê Google Sheets sem cache
- Processa dados automaticamente
- DTE só precisa atualizar a planilha mensalmente
- Painel se atualiza sozinho ao recarregar

## 📁 Estrutura de Arquivos

```
/hub-comlurb/
├── assets/
│   ├── css/
│   │   └── hub-premium.css          ← CSS compartilhado (já existe)
│   ├── components/
│   │   ├── hub-utils.js             ← Componentes HUB (já existem)
│   │   ├── hub-cards.js
│   │   ├── hub-charts.js
│   │   ├── hub-filters.js
│   │   └── hub-layout.js
│   └── logo.png
│
└── dte/                              ← PAINEL DTE (NOVO)
    ├── index.html                    ← Estrutura HTML (4 telas)
    ├── app.js                        ← Lógica completa (799 linhas)
    ├── data.js                       ← URL Google Sheets
    └── README.md                     ← Este arquivo
```

## 🚀 Instalação

### 1. Copie os 3 arquivos para a pasta `/dte/`

```bash
hub-comlurb/
└── dte/
    ├── index.html
    ├── app.js
    ├── data.js
    └── README.md
```

### 2. Certifique-se que a pasta `assets/` existe

O painel precisa dos componentes HUB em `../assets/`

### 3. Configure a URL da planilha

Em `data.js`, verifique a URL:

```javascript
const DATA_URL = "https://docs.google.com/.../pub?output=csv";
```

### 4. Abra o painel

Navegue até: `http://seu-servidor/hub-comlurb/dte/index.html`

Ou publique no GitHub Pages: `https://urbanflowrio.github.io/HUB_COMLURB/dte/`

## 📊 Estrutura da Planilha Google Sheets

**IMPORTANTE:** Manter a estrutura de seções para o painel funcionar:

```
I - Recebimento Resíduos Totais
II - Recebimento Residos Recebidos nas ETR's
V - Geração Biogás
VII - Geração Chorume
B - Coleta Domiociliar e Comunidade
B - Sobrecarga >10%
B - Análise de Horas Extras
C - MANUTENÇÃO FROTA PRÓPRIA
D - MANUTENÇÃO PREDIAL
```

## 🎨 Padrão HUB COMLURB

### ✅ Seguindo 100% o padrão:
- **SEM ícones** nas tabs (só texto)
- Usa componentes compartilhados
- Footer institucional padronizado
- CSS `hub-premium.css`
- Estrutura modular

### ❌ Removidos:
- ❌ Ícones emoji nas tabs
- ❌ Código inline
- ❌ Dependências extras

## 🔧 Customização

### Adicionar novo KPI

```javascript
// Em app.js > renderTela1()
{
  label: "Novo KPI",
  value: calculoDoValor,
  note: "Descrição",
  format: "int",
  color: "green"
}
```

### Adicionar novo gráfico

```javascript
HUB.charts.bar("novoGrafico", {
  labels: [...],
  values: [...]
});
```

## 📞 Suporte

Gabinete da Presidência  
HUB COMLURB • Núcleo de Inteligência e Gestão Estratégica Operacional

---

**Versão:** 2.0 - Completa  
**Atualizado:** Maio 2025  
**Linhas de código:** ~800 (app.js)
