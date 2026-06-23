import { useState, useEffect, useRef } from 'react'

const WHATS = '5567982036545'
const WHATS_MSG = encodeURIComponent('Olá! Vim pelo site e quero saber mais sobre os sistemas da AL Dev Software.')
const whatsLink = `https://wa.me/${WHATS}?text=${WHATS_MSG}`

const LINK_LOJA = 'https://lojamvp-frontend.vercel.app'
const LINK_ADMIN = 'https://lojamvp-admin-frontend.vercel.app'

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
    }, { threshold: 0.12 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function Nav() {
  const [aberto, setAberto] = useState(false)
  const fechar = () => setAberto(false)
  return (
    <nav className="nav">
      <a href="#top" className="nav-logo" onClick={fechar}>
        <span className="nav-logo-mark">{'</>'}</span>
        AL Dev Software
      </a>
      <div className="nav-links">
        <a href="#servicos">Serviços</a>
        <a href="#sistema">Sistema</a>
        <a href="#telas">Telas</a>
        <a href="#perfis">Perfis</a>
        <a href="#precos">Preços</a>
        <a href={LINK_ADMIN} target="_blank" rel="noreferrer" className="nav-login">Área do cliente</a>
        <a href={LINK_LOJA} target="_blank" rel="noreferrer" className="nav-cta">Acessar loja →</a>
      </div>
      <button className="nav-toggle" aria-label="Menu" onClick={() => setAberto(v => !v)}>
        {aberto ? '✕' : '☰'}
      </button>

      {aberto && <div className="nav-mobile-overlay" onClick={fechar} />}
      <div className={`nav-mobile${aberto ? ' open' : ''}`}>
        <a href="#servicos" onClick={fechar}>Serviços</a>
        <a href="#sistema" onClick={fechar}>Sistema</a>
        <a href="#telas" onClick={fechar}>Telas</a>
        <a href="#perfis" onClick={fechar}>Perfis</a>
        <a href="#precos" onClick={fechar}>Preços</a>
        <a href="#contato" onClick={fechar}>Contato</a>
        <div className="nav-mobile-divider" />
        <a href={LINK_ADMIN} target="_blank" rel="noreferrer" className="nav-mobile-login" onClick={fechar}>Área do cliente</a>
        <a href={LINK_LOJA} target="_blank" rel="noreferrer" className="nav-mobile-cta" onClick={fechar}>Acessar loja →</a>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-glow" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-eyebrow"><span />software que resolve de verdade</div>
        <h1>Sistemas sob medida e <span className="accent">gestão completa</span> para a sua loja.</h1>
        <p className="hero-sub">
          Desenvolvemos software personalizado e oferecemos um sistema pronto para
          controlar vendas, estoque, clientes e cobranças — tudo num lugar só, do balcão ao relatório.
        </p>
        <div className="hero-actions">
          <a href="#contato" className="btn-primary">Pedir orçamento →</a>
          <a href="#sistema" className="btn-ghost">Ver o sistema</a>
        </div>
      </div>

      <div className="hero-devices">
        {/* Notebook */}
        <div className="laptop">
          <div className="laptop-screen">
            <DashboardDemo />
          </div>
          <div className="laptop-base"><div className="laptop-notch" /></div>
        </div>
        {/* iPhone */}
        <div className="phone">
          <div className="phone-notch" />
          <div className="phone-screen">
            <DashboardDemo mobile />
          </div>
        </div>
      </div>
    </header>
  )
}

function DashboardDemo({ mobile }) {
  return (
    <div className={`dash${mobile ? ' dash-mobile' : ''}`}>
      <div className="dash-top">
        <div className="dash-brand"><span className="dash-logo" />Minha Loja</div>
        {!mobile && <span className="dash-date">Hoje · 23 jun</span>}
      </div>
      <div className="dash-cards">
        <div className="dash-card"><div className="dash-v">R$ 1.840</div><div className="dash-l">Vendas hoje</div></div>
        <div className="dash-card"><div className="dash-v green">12</div><div className="dash-l">Vendas</div></div>
        {!mobile && <div className="dash-card"><div className="dash-v">23</div><div className="dash-l">Produtos</div></div>}
      </div>
      <div className="dash-chart">
        {[40, 65, 50, 80, 60, 95, 72].map((h, i) => (
          <div className="dash-bar" key={i} style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="dash-list">
        <div className="dash-row"><span>Vestido floral (M)</span><span className="dash-tag">pix</span></div>
        <div className="dash-row"><span>Calça jeans (40)</span><span className="dash-tag">crédito</span></div>
        {!mobile && <div className="dash-row"><span>Camiseta (G / Preto)</span><span className="dash-tag">dinheiro</span></div>}
      </div>
    </div>
  )
}

const OFFERINGS = [
  { icon: '🧩', title: 'Software sob medida', desc: 'Sistemas, automações e integrações desenhados para o seu processo — não o contrário. Você descreve o problema, a gente entrega a solução.' },
  { icon: '🛍️', title: 'Sistema de gestão de lojas', desc: 'Plataforma pronta para vestuário, calçados e semi joias: PDV, estoque por variação, trocas, crédito de cliente e relatórios.' },
  { icon: '🛠️', title: 'Painel administrativo', desc: 'Gerencie várias lojas, faturamento e acessos num painel central, com cobrança automática via Pix e controle de assinaturas.' },
]

function Offerings() {
  useReveal()
  return (
    <section className="section" id="servicos">
      <div className="reveal">
        <div className="section-eyebrow">o que fazemos</div>
        <h2 className="section-title">Três formas de tirar a sua operação do papel.</h2>
        <p className="section-lead">Do código sob medida ao produto pronto para usar amanhã. Você escolhe por onde começar.</p>
      </div>
      <div className="offerings">
        {OFFERINGS.map((o, i) => (
          <div className="offer reveal" key={i} style={{ transitionDelay: `${i * 80}ms` }}>
            <div className="offer-num">0{i + 1}</div>
            <span className="offer-icon">{o.icon}</span>
            <h3>{o.title}</h3>
            <p>{o.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Product() {
  useReveal()
  const features = [
    'Caixa (PDV) com leitura de variações, desconto e duas formas de pagamento',
    'Controle de estoque por tamanho e cor, com alerta de estoque baixo',
    'Trocas de produtos com geração de crédito para o cliente',
    'Cadastro de clientes com histórico de compras e aniversário',
    'Relatórios de vendas, produtos e formas de pagamento por período',
    'Acesso pelo celular, tablet ou computador',
  ]
  return (
    <div className="product" id="sistema">
      <div className="product-inner">
        <div className="reveal">
          <div className="section-eyebrow">sistema pronto</div>
          <h2 className="section-title">Tudo que a loja precisa, sem planilha.</h2>
          <p className="section-lead">Um sistema feito no dia a dia de lojas reais. Simples para o operador, completo para o dono.</p>
          <ul className="product-features">
            {features.map((f, i) => (
              <li key={i}><span className="check">✓</span>{f}</li>
            ))}
          </ul>
        </div>
        <div className="product-panel reveal">
          <div className="panel-head">
            <div className="panel-head-title"><span className="panel-logo" />Minha Loja</div>
            <span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'JetBrains Mono' }}>hoje</span>
          </div>
          <div className="panel-stats">
            <div className="panel-stat"><div className="v">R$ 1.840</div><div className="l">vendas hoje</div></div>
            <div className="panel-stat"><div className="v green">23</div><div className="l">produtos</div></div>
            <div className="panel-stat"><div className="v">8</div><div className="l">clientes</div></div>
          </div>
          <div className="panel-rows">
            <div className="panel-row"><span className="name">Vestido floral (M / Azul)</span><span className="badge">pix</span></div>
            <div className="panel-row"><span className="name">Calça jeans (40)</span><span className="badge">crédito 3x</span></div>
            <div className="panel-row"><span className="name">Camiseta básica (G / Preto)</span><span className="badge">dinheiro</span></div>
            <div className="panel-row"><span className="name">Troca · Bianca Borges</span><span className="badge">+R$ 19,90</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PLANS = [
  {
    tag: 'sistema de lojas', name: 'Loja', desc: 'Para quem quer começar a vender organizado hoje.',
    value: 'A partir de', big: 'R$ 89,90', note: 'por mês · 7 dias grátis para testar',
    feats: ['PDV, estoque e clientes', 'Trocas e crédito de cliente', 'Relatórios e fluxo de caixa', 'Suporte por WhatsApp'],
  },
  {
    tag: 'mais escolhido', name: 'Loja + Implantação', desc: 'Sistema configurado e pronto, com seus produtos cadastrados.', featured: true,
    value: 'Implantação a partir de', big: 'R$ 250', note: '+ mensalidade · cadastro e treinamento inclusos',
    feats: ['Tudo do plano Loja', 'Cadastro inicial de produtos', 'Treinamento da equipe', 'Personalização de marca e cores'],
  },
  {
    tag: 'sob medida', name: 'Projeto', desc: 'Software personalizado para a sua necessidade específica.',
    value: 'Orçamento', big: 'sob medida', note: 'conforme o escopo do projeto',
    feats: ['Levantamento de requisitos', 'Desenvolvimento dedicado', 'Integrações e automações', 'Acompanhamento contínuo'],
  },
]

function Telas() {
  useReveal()
  return (
    <section className="section" id="telas">
      <div className="reveal">
        <div className="section-eyebrow">por dentro do sistema</div>
        <h2 className="section-title">Veja como é por dentro.</h2>
        <p className="section-lead">Telas reais do dia a dia, direto do celular: caixa, cadastro de produtos e controle de estoque.</p>
      </div>

      <div className="telas-grid">
        {/* Caixa */}
        <div className="tela reveal">
          <div className="tela-label"><span className="tela-dot" /> Caixa (PDV)</div>
          <div className="tela-frame">
            <div className="tela-inner">
              <div className="tela-scroll">
                <div className="cx-demo">
                  <div className="cx-demo-headrow">
                    <span className="cx-demo-head">Caixa</span>
                    <span className="cx-demo-troca">🔄 Troca</span>
                  </div>
                  <div className="cx-demo-search"><i>🔍</i> Buscar produto...</div>
                  <div className="cx-demo-cart">
                    <div className="cx-demo-item">
                      <div><div className="cx-demo-name">Vestido floral (M / Azul)</div><div className="cx-demo-stock">estoque: 6 un.</div></div>
                      <div className="cx-demo-qty">1</div>
                      <div className="cx-demo-price">R$ 119,90</div>
                    </div>
                    <div className="cx-demo-item">
                      <div><div className="cx-demo-name">Calça jeans (40)</div><div className="cx-demo-stock">estoque: 12 un.</div></div>
                      <div className="cx-demo-qty">2</div>
                      <div className="cx-demo-price">R$ 179,80</div>
                    </div>
                  </div>
                  <div className="cx-demo-block">
                    <div className="cx-demo-blocklabel">👤 Cliente</div>
                    <div className="cx-demo-clientbox">Buscar cliente...</div>
                  </div>
                  <div className="cx-demo-disc">Desconto: − R$ 10,00</div>
                  <div className="cx-demo-total">
                    <span>Total</span><strong>R$ 289,70</strong>
                  </div>
                  <div className="cx-demo-block">
                    <div className="cx-demo-blockhead">
                      <span className="cx-demo-blocklabel">Forma de pagamento</span>
                      <span className="cx-demo-twoways">+ 2 formas</span>
                    </div>
                    <div className="cx-demo-pays">
                      <span className="cx-demo-pay">💵<i>Dinheiro</i></span>
                      <span className="cx-demo-pay active">⚡<i>Pix</i></span>
                      <span className="cx-demo-pay">💳<i>Crédito</i></span>
                      <span className="cx-demo-pay">🏦<i>Débito</i></span>
                    </div>
                  </div>
                  <div className="cx-demo-finish">✓ Finalizar venda · R$ 289,70</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produtos */}
        <div className="tela reveal" style={{ transitionDelay: '100ms' }}>
          <div className="tela-label"><span className="tela-dot" /> Cadastro de produtos</div>
          <div className="tela-frame">
            <div className="tela-inner">
              <div className="tela-scroll">
                <div className="pr-demo">
                  <div className="cx-demo-head">Novo produto</div>
                  <div className="pr-demo-field"><label>Nome</label><div className="pr-demo-input">Camiseta Básica</div></div>
                  <div className="pr-demo-row">
                    <div className="pr-demo-field"><label>Categoria</label><div className="pr-demo-input">Camiseta</div></div>
                    <div className="pr-demo-field"><label>Cód. barras</label><div className="pr-demo-input">789100…</div></div>
                  </div>
                  <div className="pr-demo-row">
                    <div className="pr-demo-field"><label>Preço custo</label><div className="pr-demo-input">R$ 38,00</div></div>
                    <div className="pr-demo-field"><label>Preço venda</label><div className="pr-demo-input">R$ 59,90</div></div>
                  </div>
                  <div className="pr-demo-field"><label>Status</label><div className="pr-demo-input">Ativo</div></div>
                  <div className="pr-demo-vartitle">Variações (Tamanho / Cor)</div>
                  <div className="pr-demo-grid">
                    <div className="pr-demo-gridhead"><span>Tam.</span><span>Cor</span><span>Est.</span><span>Mín.</span></div>
                    <div className="pr-demo-gridrow"><span className="pr-demo-cell">P</span><span className="pr-demo-cell">Preto</span><span className="pr-demo-cell">8</span><span className="pr-demo-cell">2</span></div>
                    <div className="pr-demo-gridrow"><span className="pr-demo-cell">M</span><span className="pr-demo-cell">Preto</span><span className="pr-demo-cell">5</span><span className="pr-demo-cell">2</span></div>
                    <div className="pr-demo-gridrow"><span className="pr-demo-cell">G</span><span className="pr-demo-cell">Branco</span><span className="pr-demo-cell">3</span><span className="pr-demo-cell">2</span></div>
                    <div className="pr-demo-gridrow"><span className="pr-demo-cell">GG</span><span className="pr-demo-cell">Azul</span><span className="pr-demo-cell">6</span><span className="pr-demo-cell">2</span></div>
                  </div>
                  <div className="pr-demo-margin">Margem: <strong>+58%</strong> · Lucro: <strong>R$ 21,90</strong></div>
                  <div className="cx-demo-finish">Salvar produto</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estoque */}
        <div className="tela reveal" style={{ transitionDelay: '200ms' }}>
          <div className="tela-label"><span className="tela-dot" /> Controle de estoque</div>
          <div className="tela-frame">
            <div className="tela-inner">
              <div className="tela-scroll">
                <div className="es-demo">
                  <div className="cx-demo-head">Estoque</div>
                  <div className="es-demo-tabs">
                    <span className="es-demo-tab active">Visão geral</span>
                    <span className="es-demo-tab">Movimentos</span>
                  </div>
                  <div className="es-demo-alert">⚠️ 2 produtos com estoque baixo</div>
                  <div className="es-demo-list">
                    <div className="es-demo-row">
                      <div className="es-demo-name">Vestido floral</div>
                      <div className="es-demo-vars"><span>M/Azul · 6</span><span className="low">P/Rosa · 1</span></div>
                    </div>
                    <div className="es-demo-row">
                      <div className="es-demo-name">Calça jeans</div>
                      <div className="es-demo-vars"><span>40 · 12</span><span>42 · 7</span></div>
                    </div>
                    <div className="es-demo-row">
                      <div className="es-demo-name">Tênis casual</div>
                      <div className="es-demo-vars"><span className="low">38 · 4</span><span>39 · 9</span></div>
                    </div>
                  </div>
                  <div className="es-demo-movtitle">Últimos movimentos</div>
                  <div className="es-demo-mov">
                    <div className="es-demo-movrow"><span className="in">↓ Entrada</span><span>Calça jeans +10</span></div>
                    <div className="es-demo-movrow"><span className="out">↑ Saída</span><span>Vestido floral −1</span></div>
                    <div className="es-demo-movrow"><span className="in">↓ Entrada</span><span>Tênis casual +5</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Perfis() {
  useReveal()
  const perfis = [
    {
      icon: '👕', nome: 'Vestuário',
      desc: 'Para lojas de roupas em geral.',
      categorias: 'Camiseta, Calça, Vestido, Blusa, Bermuda, Casaco',
      tamanho: 'Letra (PP a XG) ou Número (32 a 46), automático por categoria',
      cor: 'Sim',
    },
    {
      icon: '💍', nome: 'Bijuterias e Acessórios',
      desc: 'Para semi joias, bijuterias e acessórios.',
      categorias: 'Semi Joias, Colares, Brincos, Anéis, Pulseiras',
      tamanho: 'Sem tamanho (controle por cor/modelo)',
      cor: 'Sim',
    },
    {
      icon: '👟', nome: 'Sapataria',
      desc: 'Para calçados e sapatarias.',
      categorias: 'Tênis, Sapato, Sandália, Bota, Chinelo',
      tamanho: 'Número (33 a 44)',
      cor: 'Sim',
    },
  ]
  return (
    <section className="section" id="perfis">
      <div className="reveal">
        <div className="section-eyebrow">perfis prontos</div>
        <h2 className="section-title">Já vem configurado pro seu ramo.</h2>
        <p className="section-lead">Escolha o perfil da sua loja e o sistema já vem com as categorias e os campos certos. Sem configurar nada do zero.</p>
      </div>
      <div className="perfis-grid">
        {perfis.map((p, i) => (
          <div className="perfil-card reveal" key={i} style={{ transitionDelay: `${i * 80}ms` }}>
            <span className="perfil-icon">{p.icon}</span>
            <h3>{p.nome}</h3>
            <p className="perfil-desc">{p.desc}</p>
            <div className="perfil-rows">
              <div className="perfil-row">
                <span className="perfil-key">Categorias</span>
                <span className="perfil-val">{p.categorias}</span>
              </div>
              <div className="perfil-row">
                <span className="perfil-key">Tamanho</span>
                <span className="perfil-val">{p.tamanho}</span>
              </div>
              <div className="perfil-row">
                <span className="perfil-key">Cor / variação</span>
                <span className="perfil-val">{p.cor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="perfis-note">Precisa de um ramo diferente? A gente cria um perfil sob medida para a sua loja.</p>
    </section>
  )
}

function Pricing() {
  useReveal()
  return (
    <section className="section" id="precos">
      <div className="reveal">
        <div className="section-eyebrow">preços</div>
        <h2 className="section-title">Comece pequeno. Cresça quando quiser.</h2>
        <p className="section-lead">Sem fidelidade, sem letra miúda. Você paga pelo que usa e cancela quando precisar.</p>
      </div>
      <div className="pricing-cards">
        {PLANS.map((p, i) => (
          <div className={`price-card reveal${p.featured ? ' featured' : ''}`} key={i} style={{ transitionDelay: `${i * 80}ms` }}>
            <div className="price-tag">{p.tag}</div>
            <h3>{p.name}</h3>
            <div className="desc">{p.desc}</div>
            <div className="price-value">{p.value}</div>
            <div className="price-value"><span className="big">{p.big}</span></div>
            <div className="price-note">{p.note}</div>
            <ul>
              {p.feats.map((f, j) => <li key={j}><span className="c">✓</span>{f}</li>)}
            </ul>
            <a href="#contato" className={p.featured ? 'btn-primary' : 'btn-ghost'} style={{ justifyContent: 'center' }}>Quero esse</a>
          </div>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  useReveal()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ nome: '', email: '', msg: '' })

  function enviar(e) {
    e.preventDefault()
    const texto = encodeURIComponent(`Olá! Sou ${form.nome || '(sem nome)'}.\n${form.msg || ''}\nContato: ${form.email || ''}`)
    window.open(`https://wa.me/${WHATS}?text=${texto}`, '_blank')
    setSent(true)
  }

  return (
    <div className="contact" id="contato">
      <div className="contact-inner reveal">
        <h2>Vamos conversar sobre o seu projeto?</h2>
        <p>Resposta rápida no WhatsApp ou mande os detalhes pelo formulário.</p>
        <div className="contact-actions">
          <a href={whatsLink} target="_blank" rel="noreferrer" className="btn-primary btn-whats">💬 Chamar no WhatsApp</a>
          <a href="mailto:andre.ivarras@gmail.com" className="btn-ghost">✉️ Enviar e-mail</a>
        </div>
        <form className="contact-form" onSubmit={enviar}>
          <div className="row">
            <input placeholder="Seu nome" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
            <input placeholder="E-mail ou telefone" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <textarea rows={4} placeholder="Conte o que você precisa..." value={form.msg} onChange={e => setForm(f => ({ ...f, msg: e.target.value }))} />
          <button type="submit" className="btn-primary">{sent ? 'Abrindo WhatsApp...' : 'Enviar mensagem'}</button>
        </form>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="footer-logo"><span className="nav-logo-mark">{'</>'}</span>AL Dev Software</div>
        <p style={{ marginTop: 8 }}>Desenvolvimento de software e gestão para lojas.</p>
      </div>
      <div className="footer-links">
        <a href="#servicos">Serviços</a>
        <a href="#sistema">Sistema</a>
        <a href="#precos">Preços</a>
        <a href={whatsLink} target="_blank" rel="noreferrer">WhatsApp</a>
      </div>
      <p>© {new Date().getFullYear()} AL Dev Software</p>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Offerings />
      <Product />
      <Telas />
      <Perfis />
      <Pricing />
      <Contact />
      <Footer />
    </>
  )
}