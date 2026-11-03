using System;
using System.Drawing;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

namespace PixelSurvivors
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainForm());
        }
    }

    public class MainForm : Form
    {
        public MainForm()
        {
            this.Text = "PIXEL SURVIVORS - Desktop Launcher v0.9.0";
            this.Size = new Size(720, 520);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.BackColor = Color.FromArgb(12, 16, 27);
            this.ForeColor = Color.White;

            try
            {
                if (File.Exists("icon.ico"))
                {
                    this.Icon = new Icon("icon.ico");
                }
                else if (File.Exists("public/assets/icon.ico"))
                {
                    this.Icon = new Icon("public/assets/icon.ico");
                }
            }
            catch { }

            // Title Label
            Label lblTitle = new Label();
            lblTitle.Text = "PIXEL SURVIVORS";
            lblTitle.Font = new Font("Consolas", 24, FontStyle.Bold);
            lblTitle.ForeColor = Color.FromArgb(250, 204, 21);
            lblTitle.TextAlign = ContentAlignment.MiddleCenter;
            lblTitle.Dock = DockStyle.Top;
            lblTitle.Height = 70;
            this.Controls.Add(lblTitle);

            // Subtitle
            Label lblSub = new Label();
            lblSub.Text = "Top-Down Roguelite Arena Survival - Versao Windows x64 (Alfa v0.9.0)";
            lblSub.Font = new Font("Consolas", 10, FontStyle.Regular);
            lblSub.ForeColor = Color.FromArgb(56, 189, 248);
            lblSub.TextAlign = ContentAlignment.MiddleCenter;
            lblSub.Dock = DockStyle.Top;
            lblSub.Height = 30;
            this.Controls.Add(lblSub);

            // Panel for buttons
            Panel pnl = new Panel();
            pnl.Dock = DockStyle.Fill;
            pnl.Padding = new Padding(40, 20, 40, 30);
            this.Controls.Add(pnl);

            // Play Button
            Button btnPlay = CreatePixelButton("▶ JOGAR AGORA NA ARENA (OFFLINE)", 40, Color.FromArgb(250, 204, 21), Color.Black);
            btnPlay.Click += (s, e) =>
            {
                try
                {
                    string localHtml = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "index.html");
                    if (!File.Exists(localHtml))
                    {
                        localHtml = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "public", "index.html");
                    }

                    if (File.Exists(localHtml))
                    {
                        Process.Start(new ProcessStartInfo(localHtml) { UseShellExecute = true });
                    }
                    else
                    {
                        Process.Start(new ProcessStartInfo("https://pixel-survivors.workers.dev") { UseShellExecute = true });
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Erro ao iniciar jogo: " + ex.Message, "Pixel Survivors", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            };
            pnl.Controls.Add(btnPlay);

            // Discord / Community Button
            Button btnDiscord = CreatePixelButton("💬 COMUNIDADE & FEEDBACK (DISCORD)", 110, Color.FromArgb(30, 41, 59), Color.White);
            btnDiscord.Click += (s, e) =>
            {
                try { Process.Start(new ProcessStartInfo("https://discord.com") { UseShellExecute = true }); } catch { }
            };
            pnl.Controls.Add(btnDiscord);

            // Controls & Guide Button
            Button btnGuide = CreatePixelButton("🎮 CONTROLES: WASD / SETAS (DISPARO AUTOMATICO)", 180, Color.FromArgb(30, 41, 59), Color.FromArgb(56, 189, 248));
            btnGuide.Click += (s, e) =>
            {
                MessageBox.Show(
                    "CONTROLES DO JOGO:\n\n" +
                    "- WASD ou Setas Direcionais: Mover o Heroi Mago\n" +
                    "- Disparo Magico: 100% Automatico no alvo mais proximo\n" +
                    "- Barra de Espaco ou Tecla P: Pausar o jogo\n\n" +
                    "DICA: Colete gemas de EXP pelo chao para subir de nivel e destravar novos feitiços!",
                    "Guia de Controles - Pixel Survivors",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Information
                );
            };
            pnl.Controls.Add(btnGuide);

            // Exit Button
            Button btnExit = CreatePixelButton("SAIR DO LAUNCHER", 250, Color.FromArgb(20, 25, 38), Color.Gray);
            btnExit.Click += (s, e) => { this.Close(); };
            pnl.Controls.Add(btnExit);

            // Footer info
            Label lblFooter = new Label();
            lblFooter.Text = "Build nativa para Windows 10/11 | Suporte a Taxa de Quadros Alta & Controles USB";
            lblFooter.Font = new Font("Consolas", 8, FontStyle.Regular);
            lblFooter.ForeColor = Color.FromArgb(100, 116, 139);
            lblFooter.TextAlign = ContentAlignment.MiddleCenter;
            lblFooter.Dock = DockStyle.Bottom;
            lblFooter.Height = 35;
            this.Controls.Add(lblFooter);
        }

        private Button CreatePixelButton(string text, int top, Color back, Color fore)
        {
            Button btn = new Button();
            btn.Text = text;
            btn.Top = top;
            btn.Left = 80;
            btn.Width = 480;
            btn.Height = 52;
            btn.FlatStyle = FlatStyle.Flat;
            btn.FlatAppearance.BorderSize = 2;
            btn.FlatAppearance.BorderColor = Color.Black;
            btn.BackColor = back;
            btn.ForeColor = fore;
            btn.Font = new Font("Consolas", 10, FontStyle.Bold);
            btn.Cursor = Cursors.Hand;
            return btn;
        }
    }
}
