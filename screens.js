/**
 * SMS SCREENS MODULE
 * Renderização das telas do painel SMS
 */

const SMSScreens = {
  
  /**
   * TELA 1: VISÃO EXECUTIVA
   */
  renderVisaoExecutiva() {
    const totais = SMSData.getTotais();
    const faturamentoAcum = SMSData.getFaturamentoAcumulado();
    const fatPorHospital = SMSData.getFaturamentoPorHospital();

    // KPIs
    HUB.cards.renderKPIs("kpis-exec", [
      {
        label: "Unidades Ativas",
        value: totais.hospitais,
        note: "Hospitais da rede municipal",
        color: "blue"
      },
      {
        label: "Faturamento Acumulado",
        value: HUB.utils.formatMoney(faturamentoAcum),
        note: "Período: 2024-2026",
        color: "green"
      },
      {
        label: "Efetivo Operacional",
        value: totais.garis,
        note: "Garis ativos no contrato",
        color: "blue"
      },
      {
        label: "Containers Totais",
        value: totais.containersTotal || "-",
        note: "Total de containers",
        color: "orange"
      },
      {
        label: "Containers RSS",
        value: totais.containersRSS || "-",
        note: "Resíduos de Saúde Sólidos",
        color: "red"
      }
    ]);

    // Gráfico: Faturamento por Hospital
    const hospitaisOrdenados = Object.entries(fatPorHospital)
      .filter(([nome, valor]) => valor > 0)
      .sort((a, b) => b[1] - a[1]);

    HUB.charts.renderHTMLBars("chart-hospitais", 
      hospitaisOrdenados.map(([nome, valor]) => ({
        name: nome,
        value: valor,
        pct: (valor / faturamentoAcum * 100)
      })),
      { 
        title: "Faturamento por Hospital",
        hint: "Acumulado 2024-2026"
      }
    );

    // Mapa
    this.renderMapa();

    // Card com resumo
    document.getElementById("resumo-contrato").innerHTML = `
      <div class="panel">
        <div class="panelHead">
          <h2>Resumo do Contrato</h2>
          <div class="hint">Informações gerais da execução contratual</div>
        </div>
        <div class="body">
          <div style="display:grid; gap:16px;">
            <div>
              <strong style="display:block; color:#b8d4f2; font-size:11px; letter-spacing:0.16em; text-transform:uppercase; margin-bottom:8px;">Expectativa Mensal</strong>
              <div style="font-size:28px; font-weight:950;">${HUB.utils.formatMoney(totais.receitaMensal)}</div>
            </div>
            <div style="border-top:1px solid rgba(255,255,255,0.08); padding-top:12px;">
              <strong style="display:block; margin-bottom:12px;">Hospitais Ativos:</strong>
              ${SMSData.getHospitaisAtivos().map(h => `
                <div style="display:grid; grid-template-columns:1fr auto; gap:10px; margin-bottom:10px; padding:10px; background:rgba(19,40,64,0.5); border-radius:10px;">
                  <div>
                    <strong style="display:block; color:#eaf3ff;">${h.sigla}</strong>
                    <small style="color:#c7d8ee;">${h.garis} garis • ${h.containersTotal || 0} containers</small>
                  </div>
                  <div style="text-align:right;">
                    <strong style="display:block; color:#5b9bd5; font-size:16px;">${HUB.utils.formatMoney(h.receitaMensal)}</strong>
                    <small style="color:#aebfd5;">mensal</small>
                  </div>
                </div>
              `).join("")}
            </div>
            <div style="border-top:1px solid rgba(255,255,255,0.08); padding-top:12px; color:#c7d8ee; font-size:13px; line-height:1.5;">
              <strong style="display:block; margin-bottom:6px; color:#fff;">Observação:</strong>
              Hospital Municipal Ronaldo Gazolla saiu do contrato em meados de 2024.
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * TELA 2: ESTRUTURA CONTRATUAL
   */
  renderEstruturaContratual() {
    const hospitais = SMSData.getHospitaisAtivos();

    const html = hospitais.map(h => `
      <div class="panel">
        <div class="panelHead">
          <div>
            <h2>${h.nome}</h2>
            <div class="hint">${h.sigla}</div>
          </div>
        </div>
        <div class="body">
          <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:14px; margin-bottom:16px;">
            
            <div style="background:#132840; border-radius:14px; padding:16px;">
              <small style="display:block; color:#a8bdd5; font-size:9px; font-weight:900; letter-spacing:0.13em; text-transform:uppercase;">Receita Mensal</small>
              <strong style="display:block; font-size:24px; margin-top:8px; color:#5b9bd5;">${HUB.utils.formatMoney(h.receitaMensal)}</strong>
            </div>

            <div style="background:#132840; border-radius:14px; padding:16px;">
              <small style="display:block; color:#a8bdd5; font-size:9px; font-weight:900; letter-spacing:0.13em; text-transform:uppercase;">Efetivo Operacional</small>
              <strong style="display:block; font-size:24px; margin-top:8px;">${h.garis} garis</strong>
            </div>

            <div style="background:#132840; border-radius:14px; padding:16px;">
              <small style="display:block; color:#a8bdd5; font-size:9px; font-weight:900; letter-spacing:0.13em; text-transform:uppercase;">Containers Totais</small>
              <strong style="display:block; font-size:24px; margin-top:8px; color:#e87535;">${h.containersTotal || "-"}</strong>
            </div>

            <div style="background:#132840; border-radius:14px; padding:16px;">
              <small style="display:block; color:#a8bdd5; font-size:9px; font-weight:900; letter-spacing:0.13em; text-transform:uppercase;">Containers RSS</small>
              <strong style="display:block; font-size:24px; margin-top:8px; color:#ef6a5d;">${h.containersRSS || "-"}</strong>
            </div>

          </div>

          <div style="display:grid; gap:10px; padding-top:14px; border-top:1px solid rgba(255,255,255,0.08);">
            <div style="display:grid; grid-template-columns:140px 1fr; gap:10px;">
              <span style="color:#aebfd5;">Vencimento:</span>
              <strong>${h.vencimento}</strong>
            </div>
            <div style="display:grid; grid-template-columns:140px 1fr; gap:10px;">
              <span style="color:#aebfd5;">Reajuste:</span>
              <strong>${h.reajuste}</strong>
            </div>
            <div style="display:grid; grid-template-columns:140px 1fr; gap:10px;">
              <span style="color:#aebfd5;">Localização:</span>
              <strong>${h.lat.toFixed(4)}, ${h.lng.toFixed(4)}</strong>
            </div>
          </div>
        </div>
      </div>
    `).join("");

    document.getElementById("estrutura-cards").innerHTML = html;
  },

  /**
   * TELA 3: TERRITORIAL
   */
  renderTerritorial() {
    const hospitais = SMSData.getHospitaisAtivos();
    const totais = SMSData.getTotais();

    // Resumo territorial
    document.getElementById("territorial-summary").innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px;">
        <div style="background:#132840; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:16px;">
          <small style="display:block; color:#a8bdd5; font-size:9px; font-weight:900; letter-spacing:0.13em; text-transform:uppercase; margin-bottom:8px;">Unidades Hospitalares</small>
          <strong style="display:block; font-size:24px; color:#fff;">${totais.hospitais}</strong>
          <span style="display:block; color:#c7d8ee; font-size:12px; margin-top:6px;">Ativas no contrato</span>
        </div>

        <div style="background:#132840; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:16px;">
          <small style="display:block; color:#a8bdd5; font-size:9px; font-weight:900; letter-spacing:0.13em; text-transform:uppercase; margin-bottom:8px;">Efetivo Total</small>
          <strong style="display:block; font-size:24px; color:#fff;">${totais.garis}</strong>
          <span style="display:block; color:#c7d8ee; font-size:12px; margin-top:6px;">Garis no contrato</span>
        </div>

        <div style="background:#132840; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:16px;">
          <small style="display:block; color:#a8bdd5; font-size:9px; font-weight:900; letter-spacing:0.13em; text-transform:uppercase; margin-bottom:8px;">Containers RSS</small>
          <strong style="display:block; font-size:24px; color:#fff;">${totais.containersRSS || "-"}</strong>
          <span style="display:block; color:#c7d8ee; font-size:12px; margin-top:6px;">Resíduos biológicos</span>
        </div>
      </div>
    `;

    // Ranking de unidades
    const ranking = hospitais
      .sort((a, b) => b.garis - a.garis)
      .map(h => `
        <div style="display:grid; grid-template-columns:180px 1fr 82px 70px; gap:10px; align-items:center; background:rgba(19,40,64,0.72); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:12px; cursor:pointer; transition:0.18s;" onmouseover="this.style.borderColor='#6fa7d8'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)'">
          <div style="font-weight:900; color:#eaf3ff; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${h.sigla}</div>
          <div style="height:18px; background:#09182a; border-radius:999px; overflow:hidden;">
            <div style="height:100%; width:${(h.garis / totais.garis * 100).toFixed(1)}%; background:linear-gradient(90deg,#2f67a5,#5b9bd5); border-radius:999px;"></div>
          </div>
          <div style="text-align:right; font-weight:900; color:#fff;">${h.garis}</div>
          <div style="text-align:right; font-weight:900; color:#fff;">${(h.garis / totais.garis * 100).toFixed(1)}%</div>
        </div>
      `).join("");

    document.getElementById("territorial-rank").innerHTML = `
      <div class="panel">
        <div class="panelHead">
          <h2>Ranking de Unidades</h2>
          <div class="hint">Por efetivo operacional</div>
        </div>
        <div class="body">
          <div style="display:grid; gap:10px;">
            ${ranking}
          </div>
        </div>
      </div>
    `;

    // Mapa territorial
    this.renderMapa("mapa-territorial");
  },

  /**
   * Renderiza mapa com hospitais
   */
  renderMapa(containerId = "mapa-exec") {
    const hospitais = SMSData.getHospitaisParaMapa();
    
    const mapHtml = `
      <div class="panel">
        <div class="panelHead">
          <h2>Distribuição Territorial</h2>
          <div class="hint">Localização das unidades hospitalares</div>
        </div>
        <div class="body">
          <div style="position:relative; min-height:320px; background:radial-gradient(circle at 35% 45%,rgba(75,134,189,.55),transparent 18%), radial-gradient(circle at 62% 50%,rgba(232,117,53,.45),transparent 16%), radial-gradient(circle at 42% 72%,rgba(120,170,163,.35),transparent 18%), linear-gradient(135deg,#08192d,#102844); border-radius:18px; border:1px solid rgba(255,255,255,.08); overflow:hidden;">
            
            <div style="position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px); background-size:34px 34px;"></div>

            ${hospitais.map((h, i) => `
              <div style="position:absolute; left:${25 + (i * 20)}%; top:${30 + (i * 15)}%; background:rgba(6,17,31,0.9); border:1px solid #4b86bd; border-radius:12px; padding:10px; min-width:180px; box-shadow:0 8px 24px rgba(0,0,0,0.3);">
                <strong style="display:block; color:#5b9bd5; font-size:13px; margin-bottom:6px;">${h.sigla}</strong>
                <div style="font-size:11px; color:#c7d8ee; line-height:1.4;">
                  ${h.garis} garis<br>
                  ${h.containers || 0} containers${h.containersRSS ? ` (${h.containersRSS} RSS)` : ""}<br>
                  <span style="color:#aebfd5; font-size:10px;">${h.lat.toFixed(4)}, ${h.lng.toFixed(4)}</span>
                </div>
              </div>
            `).join("")}

            <div style="position:absolute; left:16px; right:16px; bottom:16px; background:rgba(6,17,31,.85); border:1px solid rgba(255,255,255,.12); border-radius:14px; padding:13px; color:#d9e6f8;">
              <strong style="display:block; margin-bottom:4px;">Mapa Interativo</strong>
              <span style="font-size:12px; color:#aebfd5;">Visualização geográfica das ${hospitais.length} unidades hospitalares do contrato SMS</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById(containerId).innerHTML = mapHtml;
  }
};
