import { useEffect, useRef, useState } from 'react';

interface MenuPosition {
    top: number;
    left: number;
}

export function useDropdownMenu(menuWidth: number = 144) {
    const [openId, setOpenId] = useState<number | null>(null);
    const [position, setPosition] = useState<MenuPosition>({ top: 0, left: 0 });
    const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

    const toggleMenu = (id: number) => {
        if (openId === id) {
            setOpenId(null);
            return;
        }
        const btn = buttonRefs.current[id];
        if (btn) {
            const rect = btn.getBoundingClientRect();
            setPosition({ top: rect.bottom + 4, left: rect.right - menuWidth });
        }
        setOpenId(id);
    };

    const closeMenu = () => setOpenId(null);

    useEffect(() => {
        if (openId === null) return;

        // Dropdown-nya `position: fixed` — gak ikut discroll, jadi kalau dibiarin kebuka
        // dia bakal "lepas" dari tombol aslinya. Tutup aja begitu ada scroll, pola standar
        // yang dipakai kebanyakan aplikasi buat menu jenis ini.
        const handleScroll = () => setOpenId(null);
        window.addEventListener('scroll', handleScroll, true);

        return () => window.removeEventListener('scroll', handleScroll, true);
    }, [openId]);

    return { openId, position, buttonRefs, toggleMenu, closeMenu };
}