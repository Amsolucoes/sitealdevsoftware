import { useState, useEffect, useRef } from 'react'

const WHATS = '5567982036545'
const WHATS_MSG = encodeURIComponent('Olá! Vim pelo site e quero saber mais sobre os sistemas da AL Dev Software.')
const whatsLink = `https://wa.me/${WHATS}?text=${WHATS_MSG}`

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
  return (
    <nav className="nav">
      <a href="#top" className="nav-logo">
        <span className="nav-logo-mark">{'</>'}</span>
        AL Dev Software
      </a>
      <div className="nav-links">
        <a href="#servicos">Serviços</a>
        <a href="#sistema">Sistema</a>
        <a href="#precos">Preços</a>
        <a href="#contato" className="nav-cta">Falar com a gente</a>
      </div>
      <a href="#contato" className="nav-toggle" aria-label="Contato">☰</a>
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
      <div className="terminal">
        <div className="terminal-bar">
          <span className="terminal-dot" style={{ background: '#ff5f57' }} />
          <span className="terminal-dot" style={{ background: '#febc2e' }} />
          <span className="terminal-dot" style={{ background: '#28c840' }} />
          <span className="terminal-title">aldevsoftware ~ build</span>
        </div>
        <div className="terminal-body">
          <span className="t-line t-comment">// o que entregamos</span>
          <span className="t-line"><span className="t-key">const</span> solucao = {'{'}</span>
          <span className="t-line">{'  '}software: <span className="t-str">'sob medida'</span>,</span>
          <span className="t-line">{'  '}gestaoLojas: <span className="t-str">'completa'</span>,</span>
          <span className="t-line">{'  '}suporte: <span className="t-str">'humano'</span>,</span>
          <span className="t-line">{'  '}entrega: <span className="t-str">'rápida'</span></span>
          <span className="t-line">{'}'}</span>
          <span className="t-line">&nbsp;</span>
          <span className="t-line t-comment">// pronto para crescer com você<span className="t-cursor" /></span>
        </div>
      </div>
    </header>
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
      <Pricing />
      <Contact />
      <Footer />
    </>
  )
}
