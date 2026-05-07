import { Bell, CircleQuestionMark, Moon, Search, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Header() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')

    if (saved === 'dark') {
      document.documentElement.classList.add('dark')
      setDark(true)
    }
  }, [])
  
  const toggleTheme = () => {
    const newDark = !dark

    setDark(newDark)

    if (newDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <header className="hidden border-b border-gray-200 dark:bg-[#212121] dark:border-[#424242] bg-white px-4 sm:block">
      <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4 justify-between">
        <div></div>
        <div className="bg-gray-100 dark:border-[#424242] text-black dark:text-white dark:bg-[#303030] border p-2 rounded-md min-w-xs w-lg max-w-lg border-gray-300 flex gap-2 items-center">
          <Search size={18} color="gray" />
          <input
            type="text"
            placeholder="ابحث عن منتج، عميل، أو طلب..."
            className="bg-transparent focus:outline-none w-full"
          />
        </div>

        <div className="flex gap-6">
          <Bell size={22} className="cursor-pointer" color="gray" />
          <CircleQuestionMark
            size={22}
            className="cursor-pointer"
            color="gray"
          />
          {dark ? (
            <Moon
              size={22}
              className="cursor-pointer"
              color="gray"
              onClick={toggleTheme}
            />
          ) : (
            <Sun
              size={22}
              className="cursor-pointer"
              color="gray"
              onClick={toggleTheme}
            />
          )}
        </div>
      </nav>
    </header>
  )
}
