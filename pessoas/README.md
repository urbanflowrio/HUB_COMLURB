# Painel Pessoas - Versão Refatorada

Painel de Gestão de Pessoas do HUB COMLURB, refatorado usando o sistema de componentes reutilizáveis.

## 📊 O Que É

Leitura executiva da força de trabalho da COMLURB com 5 telas de análise:
1. **Visão Geral** - KPIs principais, distribuição por diretoria
2. **Saúde Ocupacional** - Laudos, afastamentos, riscos
3. **Afastamentos** - Análise detalhada de afastamentos
4. **Demográfico** - Idade, sexo, escolaridade, distribuição territorial
5. **Analítico** - Base enriquecida com exportação Excel

## 🔄 Diferenças da Versão Anterior

### ANTES (versão original)
- **1 arquivo HTML** com ~2500 linhas
- Todo código inline (HTML + CSS + JS misturado)
- Difícil manter e evoluir
- Repetir código em cada painel novo

### DEPOIS (versão refatorada)
- **4 arquivos separados** com ~550 linhas totais
- Código organizado e modular
- Usa componentes reutilizáveis do HUB
- Template para novos painéis

## 📁 Estrutura de Arquivos

```
/pessoas_refatorado/
  ├── index.html       (~200 linhas) - Estrutura HTML
  ├── data.js          (~150 linhas) - Carregamento e enriquecimento
  ├── screens.js       (~180 linhas) - Renderização das 5 telas
  ├── app.js           (~120 linhas) - Orquestração e controle
  └── README.md        (este arquivo)
```

**Total: ~650 linhas** (vs ~2500 na versão original)

## 🚀 Como Funciona

### 1. Carregamento de Dados (data.js)

```javascript
// Carrega 3 bases em paralelo
const data = await PessoasData.load();
// Retorna array enriquecido com flags e campos calculados
```

**Fontes:**
- R54 (base funcional)
- Laudos ocupacionais
- Organograma oficial

**Enriquecimento:**
- Cruza laudos por matrícula
- Cruza organograma por setor
- Define função de atuação (cargo vs EC)
- Calcula flags (ativo, afastado, riscos)

### 2. Renderização (screens.js)

Cada tela tem sua função própria:
- `renderVisaoGeral(data)`
- `renderSaude(data)`
- `renderAfastamentos(data)`
- `renderDemografico(data)`
- `renderAnalitico(data)`

Todas usam os componentes do HUB:
```javascript
HUB.cards.render("kpis", [...]);
HUB.simpleBar.render("chart", data, options);
```

### 3. Controle (app.js)

Orquestra tudo:
- Inicializa painel
- Gerencia filtros (cascata)
- Aplica drill down
- Salva estado (localStorage)
- Coordena renderização

## 🎯 Funcionalidades

### Filtros Cascata
- Diretoria → Superintendência → Gerência → Setor
- Tipo de cargo
- Situação (ativo, afastado, laudo, risco 65+)
- Multi-select de funções

### Drill Down
Clique em qualquer gráfico/KPI para filtrar:
- KPIs clicáveis
- Barras clicáveis
- Faixas etárias clicáveis

### Exportação
- Excel com base enriquecida
- Mantém filtros aplicados

### Performance
- localStorage para cache de filtros
- Debounce na busca analítica
- Loading states

## 🔧 Como Usar

### Rodar Local
```bash
# Abra o index.html no navegador
# Ou use um servidor local:
python -m http.server 8000
# Acesse: http://localhost:8000/pessoas_refatorado/
```

### Deploy no GitHub Pages
```bash
# Copie a pasta para /pessoas/ no repo
cp -r pessoas_refatorado/* pessoas/

# Commit e push
git add pessoas/
git commit -m "Refatora painel Pessoas com componentes"
git push
```

## 🛠️ Componentes Usados

Do sistema HUB (`/assets/components/`):

- **hub-utils.js**
  - `HUB.format.*` - Formatação
  - `HUB.data.loadCSV()` - Carregamento com cache
  - `HUB.array.*` - Manipulação de arrays
  - `HUB.pick()` - Busca fuzzy de campos

- **hub-cards.js**
  - `HUB.cards.render()` - KPI cards

- **hub-layout.js**
  - `HUB.header.render()` - Header com navegação
  - `HUB.footer.render()` - Footer
  - `HUB.drillBanner.*` - Banner de drill down
  - `HUB.loading.*` - Loading states

- **hub-charts.js**
  - `HUB.simpleBar.render()` - Barras HTML (rápido)

## 📝 Manutenção

### Adicionar Nova Tela
1. Adicione `<main class="screen" id="screenNova">` no HTML
2. Crie função `renderNova(data)` em `screens.js`
3. Adicione no `navigation` do header (app.js)
4. Chame `renderNova()` no `render()` (app.js)

### Adicionar Novo KPI
```javascript
// Em screens.js
HUB.cards.render("kpis", [
  // ... KPIs existentes
  {
    label: "Novo KPI",
    value: data.filter(r => /* condição */).length,
    color: "green",
    onclick: "PessoasApp.setDrill('tipo', 'valor', 'Label')"
  }
]);
```

### Adicionar Novo Gráfico
```javascript
// Em screens.js
const grouped = HUB.array.groupCount(data, "campo");
HUB.simpleBar.render("containerId", grouped, {
  total: data.length,
  color: "blue",
  onclick: name => `PessoasApp.setDrill('campo', '${name}', '${name}')`
});
```

## 🎨 Customização

### Cores
Definidas no CSS (`hub-premium.css`):
- Navy: `#07111F`
- Blue: `#6DA5D8`
- Orange: `#E87535`
- Green: `#78AAA3`
- Red: `#EE6B6E`

### Layout
- Grid de 3 colunas: `.grid`
- Grid de 2 colunas: `.grid2`
- KPIs: `.kpis` (5 colunas)
- Painéis: `.panel`

## 🐛 Troubleshooting

**Erro ao carregar dados:**
- Verifique URLs das bases em `data.js`
- Veja console do navegador

**Filtros não funcionam:**
- Verifique se campos existem na base
- Veja mapeamento em `data.js` (`FIELDS`)

**Gráficos vazios:**
- Verifique se IDs dos containers existem no HTML
- Veja console do navegador

## 📊 Próximos Passos

Use este painel como template para:
- Painel SMS (saúde)
- Painel Contratos
- Painel Operacional
- Painel ADM

Estrutura é a mesma, só muda:
1. URLs das bases (data.js)
2. Campos de enriquecimento (data.js)
3. KPIs e gráficos (screens.js)

## 🤝 Créditos

Desenvolvido por **Greicy Moreira**  
Refatorado usando sistema de componentes HUB COMLURB  
Versão 2.0 - Mai/2026
