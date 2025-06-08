import { MapPinned, Navigation, Search } from 'lucide-react'
import './index.css'
import ImagemBG from '/map-pin-removebg.png'
import { useState } from 'react'

export function App() {
	const [cep, setCep] = useState('')
	const [data, setData] = useState('')
	const [mapUrl, setMapUrl] = useState('')

	async function handleSearchCep() {
		const cleanCEP = cep.replace(/\D/g, '')

		if (!cleanCEP || cleanCEP.length != 8) {
			return alert('Digite um CEP válido com apenas NÚMEROS!')
		}

		try {
			const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)
			const data = await response.json()

			if (data.erro) {
				alert('CEP não encontrado!')
				return
			}

			setData(data)

			const endereco = `${data.logradouro}, ${data.localidade}, ${data.uf}`
			const url = `https://www.google.com/maps?q=${encodeURIComponent(
				endereco
			)}&output=embed`

			setMapUrl(url)
		} catch (error) {
			alert('Não foi possível encontrar esta localização!')
			console.error('Erro na busca do CEP:', error)
		}
	}

	return (
		<>
			<header>
				<div className="logo">
					<h1>
						LOCALIZA <strong>CEP</strong>
					</h1>
					<MapPinned />
				</div>
			</header>

			<main>
				<div className="container">
					<div className="input-group">
						<input
							type="text"
							maxLength="8"
							placeholder="Digite o CEP (8 dígitos)"
							value={cep}
							onChange={(e) => setCep(e.target.value)}
							required
						></input>
						<button onClick={handleSearchCep}>
							localizar
							<Search />
						</button>
					</div>

					{data ? (
						<div className="result">
							<div className="infos">
								<p>
									<strong>Logradouro:</strong> {data.logradouro}
								</p>
								<p>
									<strong>Bairro:</strong> {data.bairro}
								</p>
								<p>
									<strong>Cidade:</strong> {data.localidade}
								</p>
								<p>
									<strong>Estado:</strong> {data.uf}
								</p>
							</div>

							<div className="map">
								<Navigation size={36} />
								<iframe
									title="mapa"
									width="100%"
									height="300"
									frameBorder="0"
									style={{ border: 0, borderRadius: '8px' }}
									src={mapUrl}
									allowFullScreen
									loading="lazy"
								></iframe>
							</div>
						</div>
					) : (
						<img
							src={ImagemBG}
							alt="Mapa-múndi com marcadores vermelhos indicando diversas localizações."
						/>
					)}
				</div>
			</main>
		</>
	)
}
