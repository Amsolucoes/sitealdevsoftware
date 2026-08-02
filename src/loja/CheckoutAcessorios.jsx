import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiGet, apiPost, fmt } from './api'
import { carregarCarrinho, salvarCarrinho } from './carrinho'
import './loja.css'

function formatarCep(v) {
  const d = v.replace(/\D/g, '').slice(0, 8)
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`
}

function formatarTelefone(v) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function formatarCpf(v) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

export function CheckoutAcessorios() {
  const navigate = useNavigate()
  const [carrinho, setCarrinho] = useState(carregarCarrinho())
  const [form, setForm] = useState({
    nome: '', email: '', telefone: '', cpf: '',
    cep: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '',
  })
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [frete, setFrete] = useState(null)
  const [erro, setErro] = useState('')
  const [pedido, setPedido] = useState(null) // { id, qrCode, qrCodeBase64, subtotal, frete, total }
  const [statusPagamento, setStatusPagamento] = useState('aguardando_pagamento')

  // etapa: 'dados' -> preenchendo endereço | 'pagamento' -> escolhe Pix/Cartão | 'pix' -> QR code
  const [etapa, setEtapa] = useState('dados')
  const [metodoPagamento, setMetodoPagamento] = useState('pix')
  const [gerandoPix, setGerandoPix] = useState(false)
  const [resultadoCartao, setResultadoCartao] = useState(null) // { status } após tentativa de pagamento
  const brickContainerRef = useRef(null)
  const brickInstanceRef = useRef(null)

  useEffect(() => {
    if (carrinho.length === 0 && !pedido) {
      navigate('/loja')
    }
  }, [carrinho, pedido, navigate])

  async function buscarCep(cepDigitado) {
    const digitos = cepDigitado.replace(/\D/g, '')
    if (digitos.length !== 8) return
    setBuscandoCep(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digitos}/json/`)
      const dados = await res.json()
      if (!dados.erro) {
        setForm(f => ({
          ...f,
          endereco: dados.logradouro || f.endereco,
          bairro: dados.bairro || f.bairro,
          cidade: dados.localidade || f.cidade,
          uf: dados.uf || f.uf,
        }))
        if (dados.uf) calcularFrete(dados.uf)
      }
    } catch {
      // silencioso — usuário preenche manualmente se falhar
    } finally {
      setBuscandoCep(false)
    }
  }

  async function calcularFrete(uf) {
    try {
      const res = await apiGet(`/api/loja-acessorios/frete?uf=${uf}`)
      setFrete(res.valorFrete)
    } catch {
      setFrete(null)
    }
  }

  const subtotal = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0)
  const total = subtotal + (frete ?? 0)

  function validarDados() {
    if (!form.nome.trim() || !form.email.trim() || !form.telefone.trim() || !form.cpf.trim()) {
      setErro('Preencha nome, e-mail, telefone e CPF.')
      return false
    }
    if (!form.cep.trim() || !form.endereco.trim() || !form.numero.trim() || !form.cidade.trim() || !form.uf.trim()) {
      setErro('Preencha o endereço completo, incluindo número.')
      return false
    }
    return true
  }

  function irParaPagamento(e) {
    e.preventDefault()
    setErro('')
    if (!validarDados()) return
    setEtapa('pagamento')
  }

  function payloadEndereco() {
    return {
      clienteNome: form.nome.trim(),
      clienteEmail: form.email.trim(),
      clienteTelefone: form.telefone.trim(),
      clienteCpfCnpj: form.cpf.replace(/\D/g, ''),
      cep: form.cep.trim(),
      endereco: form.endereco.trim(),
      numero: form.numero.trim(),
      complemento: form.complemento.trim() || null,
      bairro: form.bairro.trim() || null,
      cidade: form.cidade.trim(),
      uf: form.uf.trim(),
      itens: carrinho.map(i => ({ produtoId: i.produtoId, quantidade: i.quantidade })),
    }
  }

  async function gerarPix() {
    setErro('')
    setGerandoPix(true)
    try {
      const res = await apiPost('/api/loja-acessorios/pedidos', payloadEndereco())
      setPedido({ ...res, subtotal, frete })
      salvarCarrinho([])
      setCarrinho([])
      setEtapa('pix')
    } catch (e) {
      setErro(e.message || 'Erro ao gerar o pagamento. Tente novamente.')
    } finally {
      setGerandoPix(false)
    }
  }

  // Polling do status do pagamento Pix a cada 5s, enquanto aguarda
  useEffect(() => {
    if (etapa !== 'pix' || !pedido || statusPagamento !== 'aguardando_pagamento') return
    const intervalo = setInterval(async () => {
      try {
        const res = await apiGet(`/api/loja-acessorios/pedidos/${pedido.id}/status`)
        if (res.status !== 'aguardando_pagamento') {
          setStatusPagamento(res.status)
        }
      } catch {
        // ignora falha pontual, tenta de novo no próximo ciclo
      }
    }, 5000)
    return () => clearInterval(intervalo)
  }, [etapa, pedido, statusPagamento])

  // Monta o Payment Brick quando o método "cartão" é escolhido
  useEffect(() => {
    if (etapa !== 'pagamento' || metodoPagamento !== 'cartao') return
    if (!window.MercadoPago) {
      setErro('Não foi possível carregar o pagamento por cartão. Recarregue a página e tente novamente.')
      return
    }

    const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY
    const mp = new window.MercadoPago(publicKey, { locale: 'pt-BR' })
    const bricksBuilder = mp.bricks()

    async function montar() {
      if (brickInstanceRef.current) {
        brickInstanceRef.current.unmount()
        brickInstanceRef.current = null
      }
      brickInstanceRef.current = await bricksBuilder.create('payment', 'brick-cartao-container', {
        initialization: {
          amount: total,
          payer: { email: form.email.trim() },
        },
        customization: {
          paymentMethods: {
            creditCard: 'all',
            debitCard: 'all',
            maxInstallments: 12,
          },
          visual: {
            style: { theme: 'dark' },
          },
        },
        callbacks: {
          onReady: () => {},
          onError: (err) => {
            console.error(err)
            setErro('Erro ao carregar o formulário de pagamento.')
          },
          onSubmit: ({ formData }) => {
            return new Promise((resolve, reject) => {
              processarCartao(formData).then(resolve).catch(reject)
            })
          },
        },
      })
    }
    montar()

    return () => {
      if (brickInstanceRef.current) {
        brickInstanceRef.current.unmount()
        brickInstanceRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etapa, metodoPagamento])

  async function processarCartao(formData) {
    setErro('')
    try {
      const res = await apiPost('/api/loja-acessorios/pedidos/cartao', {
        ...payloadEndereco(),
        token: formData.token,
        paymentMethodId: formData.payment_method_id,
        installments: formData.installments,
        issuerId: formData.issuer_id,
      })
      salvarCarrinho([])
      setCarrinho([])
      setPedido({ ...res, subtotal, frete })
      setResultadoCartao(res)
      setEtapa('resultado')
    } catch (e) {
      setErro(e.message || 'Pagamento recusado. Confira os dados do cartão e tente novamente.')
      throw e // deixa o Brick saber que falhou, pra reabilitar o formulário
    }
  }

  // ── Tela de resultado do cartão (aprovado/recusado) ──────────────
  if (etapa === 'resultado' && resultadoCartao) {
    const aprovado = resultadoCartao.status === 'pago' || resultadoCartao.status === 'approved'
    return (
      <div className="loja-page">
        <Header />
        <div className="checkout-pix">
          {aprovado ? (
            <div className="checkout-sucesso">
              <span className="checkout-sucesso-icone">✓</span>
              <h1>Pagamento aprovado!</h1>
              <p>Seu pedido foi recebido e já vamos separar pra envio. Você vai receber atualizações por e-mail.</p>
              <a href="/" className="btn-primary">Voltar ao site</a>
            </div>
          ) : (
            <div className="checkout-sucesso">
              <span className="checkout-sucesso-icone" style={{ background: 'rgba(224,123,107,0.15)', color: '#e07b6b' }}>!</span>
              <h1>Pagamento em análise</h1>
              <p>Seu pagamento está sendo processado. Você vai receber a confirmação por e-mail em breve.</p>
              <a href="/" className="btn-primary">Voltar ao site</a>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Tela de pagamento Pix (QR code) ──────────────────────────────
  if (etapa === 'pix' && pedido) {
    return (
      <div className="loja-page">
        <Header />
        <div className="checkout-pix">
          {statusPagamento === 'pago' ? (
            <div className="checkout-sucesso">
              <span className="checkout-sucesso-icone">✓</span>
              <h1>Pagamento confirmado!</h1>
              <p>Seu pedido foi recebido e já vamos separar pra envio. Você vai receber atualizações por e-mail.</p>
              <a href="/" className="btn-primary">Voltar ao site</a>
            </div>
          ) : (
            <>
              <h1>Pague com Pix para confirmar</h1>
              <div className="checkout-pix-detalhe">
                <div><span>Subtotal</span><span>{fmt(pedido.subtotal)}</span></div>
                <div><span>Frete</span><span>{fmt(pedido.frete)}</span></div>
              </div>
              <p className="checkout-pix-valor">{fmt(pedido.total)}</p>
              {pedido.qrCodeBase64 && (
                <img
                  className="checkout-pix-qr"
                  src={`data:image/png;base64,${pedido.qrCodeBase64}`}
                  alt="QR Code Pix"
                />
              )}
              {pedido.qrCode && (
                <div className="checkout-pix-copiacola">
                  <input readOnly value={pedido.qrCode} onFocus={e => e.target.select()} />
                  <button onClick={() => navigator.clipboard.writeText(pedido.qrCode)}>Copiar código</button>
                </div>
              )}
              <p className="checkout-pix-aguardando">Aguardando confirmação do pagamento...</p>
            </>
          )}
        </div>
      </div>
    )
  }

  // ── Etapa 2: escolha do método de pagamento ──────────────────────
  if (etapa === 'pagamento') {
    return (
      <div className="loja-page">
        <Header />
        <div className="checkout-wrap" style={{ gridTemplateColumns: '1fr' , maxWidth: 560}}>
          <div className="checkout-form">
            <button className="produto-voltar" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
              onClick={() => setEtapa('dados')}>
              ← Voltar aos dados
            </button>
            <h2>Como você quer pagar?</h2>

            <div className="cx-tipo-toggle" style={{ marginBottom: 16 }}>
              <button type="button" className={metodoPagamento === 'pix' ? 'active' : ''} onClick={() => setMetodoPagamento('pix')}>Pix</button>
              <button type="button" className={metodoPagamento === 'cartao' ? 'active' : ''} onClick={() => setMetodoPagamento('cartao')}>Cartão de crédito/débito</button>
            </div>

            {erro && <p className="checkout-erro">{erro}</p>}

            {metodoPagamento === 'pix' ? (
              <button className="btn-primary" disabled={gerandoPix} onClick={gerarPix} style={{ width: '100%', justifyContent: 'center' }}>
                {gerandoPix ? 'Gerando pagamento...' : `Gerar Pix — ${fmt(total)}`}
              </button>
            ) : (
              <div id="brick-cartao-container" ref={brickContainerRef} />
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Etapa 1: formulário de dados + endereço ──────────────────────
  return (
    <div className="loja-page">
      <Header />
      <div className="checkout-wrap">
        <form className="checkout-form" onSubmit={irParaPagamento}>
          <Link to="/loja" className="produto-voltar">← Voltar para a loja</Link>
          <h2>Seus dados</h2>
          <div className="checkout-row">
            <input placeholder="Nome completo" value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
          </div>
          <div className="checkout-row two">
            <input type="email" placeholder="E-mail" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <input placeholder="Telefone" value={form.telefone}
              onChange={e => setForm(f => ({ ...f, telefone: formatarTelefone(e.target.value) }))} />
          </div>
          <div className="checkout-row">
            <input placeholder="CPF" value={form.cpf}
              onChange={e => setForm(f => ({ ...f, cpf: formatarCpf(e.target.value) }))} />
          </div>

          <h2>Endereço de entrega</h2>
          <div className="checkout-row two">
            <input placeholder="CEP" value={form.cep}
              onChange={e => setForm(f => ({ ...f, cep: formatarCep(e.target.value) }))}
              onBlur={e => buscarCep(e.target.value)} />
            <input placeholder="Número" value={form.numero}
              onChange={e => setForm(f => ({ ...f, numero: e.target.value }))} />
          </div>
          {buscandoCep && <p className="checkout-buscando">Buscando endereço...</p>}
          <div className="checkout-row">
            <input placeholder="Rua/Avenida" value={form.endereco}
              onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))} />
          </div>
          <div className="checkout-row two">
            <input placeholder="Complemento (opcional)" value={form.complemento}
              onChange={e => setForm(f => ({ ...f, complemento: e.target.value }))} />
            <input placeholder="Bairro" value={form.bairro}
              onChange={e => setForm(f => ({ ...f, bairro: e.target.value }))} />
          </div>
          <div className="checkout-row two">
            <input placeholder="Cidade" value={form.cidade}
              onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))} />
            <input placeholder="UF" maxLength={2} value={form.uf}
              onChange={e => { const uf = e.target.value.toUpperCase(); setForm(f => ({ ...f, uf })); if (uf.length === 2) calcularFrete(uf) }} />
          </div>

          {erro && <p className="checkout-erro">{erro}</p>}

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>
            Continuar para pagamento →
          </button>
        </form>

        <div className="checkout-resumo">
          <h2>Resumo do pedido</h2>
          {carrinho.map(i => (
            <div key={i.produtoId} className="checkout-resumo-item">
              <span>{i.nome} × {i.quantidade}</span>
              <span>{fmt(i.preco * i.quantidade)}</span>
            </div>
          ))}
          <div className="checkout-resumo-linha">
            <span>Subtotal</span>
            <span>{fmt(subtotal)}</span>
          </div>
          <div className="checkout-resumo-linha">
            <span>Frete</span>
            <span>{frete != null ? fmt(frete) : 'Informe o CEP'}</span>
          </div>
          <div className="checkout-resumo-total">
            <span>Total</span>
            <strong>{fmt(total)}</strong>
          </div>
        </div>
      </div>
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
    </header>
  )
}