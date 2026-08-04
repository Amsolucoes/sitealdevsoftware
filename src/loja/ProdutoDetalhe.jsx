import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { apiGet, fmt } from './api'
import { carregarCarrinho, salvarCarrinho } from './carrinho'
import './loja.css'

export function ProdutoDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [produto, setProduto] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [imagemAtiva, setImagemAtiva] = useState(0)
  const [quantidade, setQuantidade] = useState(1)
  const [adicionado, setAdicionado] = useState(false)
  const [zoomAtivo, setZoomAtivo] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [lightbox, setLightbox] = useState(false)

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  const [relacionados, setRelacionados] = useState([])

  useEffect(() => {
    setCarregando(true)
    apiGet(`/api/loja-acessorios/produtos/${id}`)
      .then(setProduto)
      .catch(() => setErro('Produto não encontrado.'))
      .finally(() => setCarregando(false))
  }, [id])

  useEffect(() => {
    if (!produto) return
    apiGet(`/api/loja-acessorios/produtos?categoria=${produto.categoria}`)
      .then(lista => setRelacionados(lista.filter(p => p.id !== produto.id).slice(0, 4)))
      .catch(() => {})
  }, [produto])

  useEffect(() => {
    if (lightbox) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [lightbox])

  if (carregando) {
    return (
      <div className="loja-page">
        <Header />
        <p className="loja-msg">Carregando produto...</p>
      </div>
    )
  }

  if (erro || !produto) {
    return (
      <div className="loja-page">
        <Header />
        <p className="loja-msg loja-erro">{erro || 'Produto não encontrado.'}</p>
        <div style={{ textAlign: 'center' }}>
          <Link to="/loja" className="btn-ghost">← Voltar para a loja</Link>
        </div>
      </div>
    )
  }

  const imagens = (produto.imagensUrls?.split(',').map(u => u.trim()).filter(Boolean)) ?? []
  const precoFinal = produto.precoPromocional ?? produto.preco

  function adicionarAoCarrinho() {
    const carrinho = carregarCarrinho()
    const existe = carrinho.find(i => i.produtoId === produto.id)
    const novo = existe
      ? carrinho.map(i => i.produtoId === produto.id ? { ...i, quantidade: i.quantidade + quantidade } : i)
      : [...carrinho, { produtoId: produto.id, nome: produto.nome, preco: precoFinal, quantidade }]
    salvarCarrinho(novo)
    setAdicionado(true)
  }

  return (
    <div className="loja-page">
      <Header />

      <div className="produto-detalhe-wrap">
        <Link to="/loja" className="produto-voltar">← Voltar para a loja</Link>

        <div className="produto-detalhe-grid">
          <div className="produto-galeria">
            <div
              className="produto-galeria-principal"
              onMouseEnter={() => setZoomAtivo(true)}
              onMouseLeave={() => setZoomAtivo(false)}
              onMouseMove={handleMouseMove}
              onClick={() => imagens.length > 0 && setLightbox(true)}
              style={{ cursor: imagens.length > 0 ? 'zoom-in' : 'default' }}
            >
              {imagens.length > 0 ? (
                <img
                  src={imagens[imagemAtiva]}
                  alt={produto.nome}
                  className={zoomAtivo ? 'zoom-ativo' : ''}
                  style={zoomAtivo ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
                />
              ) : (
                <span className="loja-card-placeholder">📦</span>
              )}
            </div>
            {imagens.length > 1 && (
              <div className="produto-galeria-miniaturas">
                {imagens.map((url, i) => (
                  <button
                    key={i}
                    className={`produto-miniatura${i === imagemAtiva ? ' ativa' : ''}`}
                    onClick={() => setImagemAtiva(i)}
                  >
                    <img src={url} alt={`${produto.nome} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="produto-info">
            <h1>{produto.nome}</h1>
            <div className="loja-card-preco" style={{ marginTop: 8, marginBottom: 16 }}>
              {produto.precoPromocional && <span className="loja-card-de">{fmt(produto.preco)}</span>}
              <span className="loja-card-por" style={{ fontSize: 28 }}>{fmt(precoFinal)}</span>
            </div>

            {produto.descricao && <p className="produto-descricao">{produto.descricao}</p>}

            {produto.disponivel ? (
              adicionado ? (
                <div className="produto-adicionado">
                  <p>✓ Adicionado ao carrinho!</p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-ghost" onClick={() => { setAdicionado(false); setQuantidade(1) }}>Continuar comprando</button>
                    <button className="btn-primary" onClick={() => navigate('/loja?carrinho=1')}>Ver carrinho →</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="produto-qtd">
                    <span>Quantidade</span>
                    <div className="produto-qtd-controles">
                      <button onClick={() => setQuantidade(q => Math.max(1, q - 1))}>−</button>
                      <span>{quantidade}</span>
                      <button onClick={() => setQuantidade(q => q + 1)}>+</button>
                    </div>
                  </div>
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={adicionarAoCarrinho}>
                    Adicionar ao carrinho
                  </button>
                </>
              )
            ) : (
              <button className="btn-ghost" disabled style={{ width: '100%', justifyContent: 'center' }}>Fora de estoque</button>
            )}
          </div>
        </div>

        {relacionados.length > 0 && (
          <div className="produto-relacionados">
            <h2>Você também pode gostar</h2>
            <div className="loja-grid" style={{ padding: 0 }}>
              {relacionados.map(p => {
                const img = p.imagensUrls?.split(',')[0]
                const preco = p.precoPromocional ?? p.preco
                return (
                  <Link key={p.id} to={`/loja/produto/${p.id}`} className="loja-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="loja-card-img">
                      {img ? <img src={img} alt={p.nome} /> : <span className="loja-card-placeholder">📦</span>}
                    </div>
                    <div className="loja-card-body">
                      <h3>{p.nome}</h3>
                      <div className="loja-card-preco">
                        {p.precoPromocional && <span className="loja-card-de">{fmt(p.preco)}</span>}
                        <span className="loja-card-por">{fmt(preco)}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {lightbox && imagens.length > 0 && (
        <div className="loja-lightbox-overlay" onClick={() => setLightbox(false)}>
          <button className="loja-lightbox-fechar" onClick={() => setLightbox(false)}>✕</button>
          <img src={imagens[imagemAtiva]} alt={produto.nome} className="loja-lightbox-img" onClick={e => e.stopPropagation()} />
          {imagens.length > 1 && (
            <div className="loja-lightbox-miniaturas" onClick={e => e.stopPropagation()}>
              {imagens.map((url, i) => (
                <button
                  key={i}
                  className={`produto-miniatura${i === imagemAtiva ? ' ativa' : ''}`}
                  onClick={() => setImagemAtiva(i)}
                >
                  <img src={url} alt={`${produto.nome} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Header() {
  return (
    <header className="loja-header">
      <Link to="/" className="loja-logo">
        <img src="/logo-aldevsoftware-padrao.png" alt="AL Dev Software" className="nav-logo-mark" />
        AL Dev Software
      </Link>
      <Link to="/loja" className="loja-carrinho-btn">🛒 Ver loja</Link>
    </header>
  )
}