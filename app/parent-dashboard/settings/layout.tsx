export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col p-4">
      <main className="flex-1">{children}</main>
    </div>
  )
}

