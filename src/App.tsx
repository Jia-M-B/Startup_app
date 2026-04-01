import React, { useEffect, useState } from "react"
import { Settings, ArrowLeft } from "lucide-react"

interface Program {
  name: string
  location: string
}

interface Category {
  id: string
  name: string
  icon: string
  programs: Program[]
}

// Import default images
import WgameplayImg from "../buttonImage/game-removebg-preview.png"
import WmonitorImg from "../buttonImage/coding-removebg-preview.png"
import WreadingBookImg from "../buttonImage/study-removebg-preview.png"
import defaultImg from "../buttonImage/startup.png"

const iconMap: Record<string, string> = {
  "game-removebg-preview.png": WgameplayImg,
  "coding-removebg-preview.png": WmonitorImg,
  "study-removebg-preview.png": WreadingBookImg,
  "startup.png": defaultImg,
}

const getGreeting = () => {
  const now = new Date()
  const totalMinutes = now.getHours() * 60 + now.getMinutes()
  if (totalMinutes < 5 * 60) return "Good to find you at midnight"
  if (totalMinutes < 12 * 60) return "Good Morning"
  if (totalMinutes < 18 * 60 + 30) return "Good Afternoon"
  return "Good Evening"
}

// ─── Add Category Component ──────────────────────────────
function AddCategoryPage({ onBack, onDone }: { onBack: () => void; onDone: (cat: Category) => void }) {
  const [newName, setNewName] = useState('')

  const handleDone = () => {
    if (!newName.trim()) return
    onDone({
      id: newName.toLowerCase().replace(/\s+/g, '-'),
      name: newName,
      icon: 'startup.png',
      programs: []
    })
  }

  return (
    <div className="min-h-screen w-full flex flex-col px-8 py-6"
      style={{ backgroundColor: '#0a0a2e' }}>
      <button onClick={onBack}
        className="flex items-center gap-2 text-white/70 hover:text-white mb-8 w-fit">
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>
      <h1 className="text-white text-3xl font-semibold mb-8">Add new category</h1>
      <div className="rounded-2xl p-6 flex flex-col gap-6 w-full max-w-2xl"
        style={{ backgroundColor: '#2d2d8e' }}>
        <div className="flex items-center gap-4">
          <span className="text-white text-lg w-20">Name:</span>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Type here..."
            className="flex-1 px-4 py-2 rounded-full text-white placeholder-white/40 focus:outline-none"
            style={{ backgroundColor: '#0a0a2e' }} />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white text-lg w-20">Icon:</span>
          <div className="w-16 h-16 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#0a0a2e' }}>
            <img src={defaultImg} alt="default" className="w-12 h-12 object-contain" />
          </div>
        </div>
        <button
          onClick={handleDone}
          className="self-end px-8 py-2 rounded-full text-white font-semibold transition hover:opacity-80"
          style={{ backgroundColor: '#0a0a2e' }}>
          Done
        </button>
      </div>
    </div>
  )
}

// ─── Add Program Component ────────────────────────────────
function AddProgramPage({ onBack, onDone }: {
  onBack: () => void
  onDone: (prog: Program) => void
}) {
  const [newProg, setNewProg] = useState({ name: '', location: '' })

  const handleTest = () => {
    if (!newProg.location.trim()) return
    ;(window as any).ipcRenderer.invoke('test-program', newProg.location)
  }

  const handleDone = () => {
    if (!newProg.name.trim() || !newProg.location.trim()) return
    onDone(newProg)
  }

  return (
    <div className="min-h-screen w-full flex flex-col px-8 py-6"
      style={{ backgroundColor: '#0a0a2e' }}>
      <button onClick={onBack}
        className="flex items-center gap-2 text-white/70 hover:text-white mb-8 w-fit">
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>
      <h1 className="text-white text-3xl font-semibold mb-8">Add new program</h1>
      <div className="rounded-2xl p-6 flex flex-col gap-6 w-full max-w-2xl"
        style={{ backgroundColor: '#2d2d8e' }}>
        <div className="rounded-xl p-4 flex flex-col gap-4"
          style={{ backgroundColor: '#1a1a5e' }}>
          <div className="flex items-center gap-4">
            <span className="text-white w-24">Name:</span>
            <input
              value={newProg.name}
              onChange={(e) => setNewProg({ ...newProg, name: e.target.value })}
              placeholder="Type here..."
              className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none border-b border-white/20 pb-1" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white w-24">Location:</span>
            <input
              value={newProg.location}
              onChange={(e) => setNewProg({ ...newProg, location: e.target.value })}
              placeholder="Type here..."
              className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none border-b border-white/20 pb-1" />
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={handleTest}
            className="px-8 py-2 rounded-full text-white font-semibold transition hover:opacity-80"
            style={{ backgroundColor: '#0a0a2e' }}>
            Testing
          </button>
          <button onClick={handleDone}
            className="px-8 py-2 rounded-full text-white font-semibold transition hover:opacity-80"
            style={{ backgroundColor: '#0a0a2e' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Pages ───────────────────────────────────────────────
type Page =
  | { name: 'main' }
  | { name: 'settings' }
  | { name: 'addCategory' }
  | { name: 'adjustCategory'; categoryId: string }
  | { name: 'addProgram'; categoryId: string }

export default function App() {
  const [categories, setCategories] = useState<Category[]>([])
  const [page, setPage] = useState<Page>({ name: 'main' })
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Load categories on start
  useEffect(() => {
    ;(window as any).ipcRenderer.invoke('get-categories').then((data: any) => {
      setCategories(data.categories)
    })
  }, [])

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') window.close()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const saveAndUpdate = (updated: Category[]) => {
    setCategories(updated)
    ;(window as any).ipcRenderer.invoke('save-categories', { categories: updated })
  }

  // ─── Main Page ─────────────────────────────────────────
  if (page.name === 'main') {
    return (
      <div className="min-h-screen w-full flex flex-col overflow-x-hidden"
        style={{ backgroundColor: '#0a0a2e' }}>
        <div className="h-[36px] flex items-center px-4 select-none"
          style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
          <span className="text-white text-sm font-medium">Lazy Person Startup Apps</span>
        </div>
        <header className="flex items-start justify-between pt-4 pb-8 px-8 md:pb-12 md:px-12"
          style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
          <div className="text-white">
            <h1 className="text-3xl font-semibold">{getGreeting()}</h1>
            <p className="text-white text-2xl mt-2 font-semibold pl-55">Koh</p>
          </div>
          <button
            onClick={() => setPage({ name: 'settings' })}
            className="text-white hover:text-white/70 transition-colors duration-200 p-2 focus:outline-none rounded-lg"
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
            aria-label="Settings">
            <Settings className="w-6 h-6 md:w-7 md:h-7" />
          </button>
        </header>
        <main className="flex-1 flex items-center justify-center px-4 pb-16">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => (window as any).ipcRenderer.send('lunch-mode', cat.id)}
                className="group relative flex flex-col items-center justify-between
                  w-full max-w-[360px] md:flex-1 md:min-w-0 h-[180px] md:h-[200px] lg:h-[220px]
                  rounded-[28px] p-5 transition-all duration-300 ease-out
                  hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(100,120,255,0.25)]
                  focus:outline-none focus:ring-2 focus:ring-[#4a4a9e]"
                style={{ backgroundColor: '#1a1a5e' }}>
                <div className="w-full flex-1 rounded-[16px] overflow-hidden mb-3 flex items-center justify-center">
                  <img
                    src={iconMap[cat.icon] || defaultImg}
                    alt={cat.name}
                    className="w-[90%] h-[90%] object-contain" />
                </div>
                <span className="text-white text-base md:text-lg font-normal tracking-wide pb-1">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </main>
      </div>
    )
  }

  // ─── Settings Page ─────────────────────────────────────
  if (page.name === 'settings') {
    return (
      <div className="min-h-screen w-full flex flex-col px-8 py-6"
        style={{ backgroundColor: '#0a0a2e' }}>
        <button onClick={() => setPage({ name: 'main' })}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-8 w-fit">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to main page</span>
        </button>
        <h1 className="text-white text-3xl font-semibold mb-8">What need to be adjust today?</h1>

        {/* Add new category */}
        <button
          onClick={() => setPage({ name: 'addCategory' })}
          className="w-64 py-3 px-6 rounded-full text-white text-left mb-10 transition hover:opacity-80"
          style={{ backgroundColor: '#2d2d8e' }}>
          Add new category
        </button>

        {/* Adjust current categories */}
        <h2 className="text-white text-xl font-semibold mb-4">Adjust Current Category</h2>
        <div className="flex flex-col gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setPage({ name: 'adjustCategory', categoryId: cat.id })}
              className="w-64 py-3 px-6 rounded-full text-white text-left transition hover:opacity-80"
              style={{ backgroundColor: '#2d2d8e' }}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ─── Add New Category Page ──────────────────────────────
  if (page.name === 'addCategory') {
    return (
      <AddCategoryPage
        onBack={() => setPage({ name: 'settings' })}
        onDone={(newCat) => { saveAndUpdate([...categories, newCat]); setPage({ name: 'settings' }) }}
      />
    )
  }

  // ─── Adjust Category Page ───────────────────────────────
  if (page.name === 'adjustCategory') {
    const cat = categories.find(c => c.id === page.categoryId)!

    const removeProgram = (index: number) => {
      const updated = categories.map(c =>
        c.id === cat.id
          ? { ...c, programs: c.programs.filter((_, i) => i !== index) }
          : c
      )
      saveAndUpdate(updated)
    }

    const deleteCategory = () => {
      saveAndUpdate(categories.filter(c => c.id !== cat.id))
      setDeleteConfirm(null)
      setPage({ name: 'settings' })
    }

    return (
      <div className="min-h-screen w-full flex flex-col px-8 py-6"
        style={{ backgroundColor: '#0a0a2e' }}>
        <button onClick={() => setPage({ name: 'settings' })}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-8 w-fit">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-white text-3xl font-semibold mb-6">{cat.name}</h1>

        <div className="rounded-2xl p-6 w-full max-w-2xl flex flex-col gap-4"
          style={{ backgroundColor: '#2d2d8e' }}>

          {/* Delete category button */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-semibold">File to be open now</span>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(cat.id)}
                className="px-4 py-1 rounded-full text-white text-sm transition hover:opacity-80"
                style={{ backgroundColor: '#8b0000' }}>
                Delete Category
              </button>
              <button
                onClick={() => setPage({ name: 'addProgram', categoryId: cat.id })}
                className="text-white text-xl font-bold hover:opacity-80">
                +
              </button>
            </div>
          </div>

          {/* Program list */}
          {cat.programs.map((prog, i) => (
            <div key={i} className="rounded-xl p-4 flex justify-between items-start"
              style={{ backgroundColor: '#1a1a5e' }}>
              <div>
                <p className="text-white font-semibold">Name: {prog.name}</p>
                <p className="text-white/70 text-sm mt-1">Location: {prog.location}</p>
              </div>
              <button
                onClick={() => removeProgram(i)}
                className="text-white text-xl font-bold hover:text-red-400 ml-4">
                -
              </button>
            </div>
          ))}
        </div>

        {/* Delete confirm dialog */}
        {deleteConfirm === cat.id && (
          <div className="fixed inset-0 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <div className="rounded-2xl p-8 flex flex-col gap-6 items-center"
              style={{ backgroundColor: '#1a1a5e' }}>
              <p className="text-white text-lg text-center">
                Are you sure you want to delete <br />
                <strong>{cat.name}</strong>?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-6 py-2 rounded-full text-white transition hover:opacity-80"
                  style={{ backgroundColor: '#2d2d8e' }}>
                  No
                </button>
                <button
                  onClick={deleteCategory}
                  className="px-6 py-2 rounded-full text-white transition hover:opacity-80"
                  style={{ backgroundColor: '#8b0000' }}>
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ─── Add New Program Page ───────────────────────────────
  if (page.name === 'addProgram') {
    const categoryId = page.categoryId
    return (
      <AddProgramPage
        onBack={() => setPage({ name: 'adjustCategory', categoryId })}
        onDone={(prog) => {
          const updated = categories.map(c =>
            c.id === categoryId ? { ...c, programs: [...c.programs, prog] } : c
          )
          saveAndUpdate(updated)
          setPage({ name: 'adjustCategory', categoryId })
        }}
      />
    )
  }

  return null
}