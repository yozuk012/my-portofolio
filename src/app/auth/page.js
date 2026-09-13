"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowUpRight, FiLock, FiMail } from "react-icons/fi";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function AuthPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(event) {
		event.preventDefault();
		setErrorMessage("");
		setIsLoading(true);

		// Debug: Log kredensial (hapus di production)
		console.log("🔐 Attempting login for:", email);
		console.log(" Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

		try {
			// Tambahkan timeout 10 detik untuk mencegah stuck
			const loginPromise = supabase.auth.signInWithPassword({ 
				email, 
				password 
			});

			const timeoutPromise = new Promise((_, reject) => {
				setTimeout(() => reject(new Error("Request timeout. Periksa koneksi internet atau Supabase URL.")), 10000);
			});

			// Race antara login dan timeout
			const { data, error } = await Promise.race([loginPromise, timeoutPromise]);

			if (error) {
				console.error("❌ Supabase Error:", error);
				setErrorMessage(error.message);
				setIsLoading(false);
				return;
			}

			if (data.user) {
				console.log("✅ Login successful:", data.user.email);
				
				// Simpan session info di console untuk debugging
				console.log("📦 Session:", data.session);
				
				// Redirect ke admin
				router.push("/admin");
				router.refresh();
			} else {
				console.error("❌ No user data returned");
				setErrorMessage("Login gagal. Data user tidak ditemukan.");
				setIsLoading(false);
			}
		} catch (error) {
			console.error("💥 Unexpected Error:", error);
			setErrorMessage(error.message || "Terjadi kesalahan tidak terduga. Silakan coba lagi.");
			setIsLoading(false);
		}
	}

	// Fungsi untuk test koneksi Supabase
	async function testConnection() {
		console.log("🧪 Testing Supabase connection...");
		try {
			const { data, error } = await supabase.from("profile").select("*").limit(1);
			if (error) {
				console.error("❌ Connection failed:", error);
				alert("Koneksi ke Supabase gagal: " + error.message);
			} else {
				console.log("✅ Connection successful!");
				alert("Koneksi Supabase berhasil!");
			}
		} catch (err) {
			console.error("💥 Test failed:", err);
			alert("Error: " + err.message);
		}
	}

	return (
		<main className="auth-page">
			<div className="auth-decor auth-decor-blue" />
			<div className="auth-decor auth-decor-yellow" />
			<section className="auth-shell" aria-labelledby="login-title">
				<div className="auth-brand-row">
					<Link className="auth-brand" href="/" aria-label="Achmad Aldino home">
						<span className="brand-mark">A</span>
						<span>Achmad Aldino</span>
					</Link>
					<span className="auth-index">01 / Login</span>
				</div>
				<div className="auth-content">
					<div className="auth-copy">
						<span className="auth-kicker"><span /> Welcome back</span>
						<h1 id="login-title">Masuk ke<br /><em>ruang kerja.</em></h1>
						<p>Kelola project dan konten portfolio Achmad Aldino dari satu tempat.</p>
					</div>
					<div className="auth-card">
						<div className="auth-card-heading">
							<span>Account access</span>
							<strong>Secure login</strong>
						</div>
						<form className="auth-form" onSubmit={handleSubmit}>
							<label htmlFor="auth-email">
								<span>Email address</span>
								<div className="auth-input">
									<FiMail aria-hidden="true" />
									<input 
										id="auth-email" 
										type="email" 
										value={email} 
										onChange={(event) => setEmail(event.target.value)} 
										placeholder="yozukakit@gmail.com" 
										autoComplete="email" 
										required 
									/>
								</div>
							</label>
							<label htmlFor="auth-password">
								<span>Password</span>
								<div className="auth-input">
									<FiLock aria-hidden="true" />
									<input 
										id="auth-password" 
										type="password" 
										value={password} 
										onChange={(event) => setPassword(event.target.value)} 
										placeholder="Masukkan password" 
										autoComplete="current-password" 
										required 
									/>
								</div>
							</label>
							
							{errorMessage && (
								<p className="auth-error" role="alert">
									{errorMessage}
								</p>
							)}
							
							<button 
								className="auth-submit" 
								type="submit" 
								disabled={isLoading}
							>
								{isLoading ? "Memproses..." : "Masuk"} <FiArrowUpRight aria-hidden="true" />
							</button>
						</form>
						
						{/* Tombol Test Koneksi (untuk debugging) */}
						<div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #dadce0' }}>
							<button 
								type="button"
								onClick={testConnection}
								style={{
									width: '100%',
									padding: '10px',
									background: '#f1f3f4',
									border: '1px solid #dadce0',
									borderRadius: '4px',
									cursor: 'pointer',
									fontSize: '11px',
									color: '#5f6368'
								}}
							>
								🧪 Test Supabase Connection
							</button>
						</div>
						
						<p className="auth-note">Akses ini hanya untuk pengelolaan portfolio.</p>
					</div>
				</div>
				<Link className="auth-back" href="/">
					<FiArrowUpRight aria-hidden="true" /> Kembali ke portfolio
				</Link>
			</section>
		</main>
	);
}