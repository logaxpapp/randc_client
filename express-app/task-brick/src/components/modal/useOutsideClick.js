// useOutsideClick.js
import { useEffect } from 'react';

function useOutsideClick(ref, onClose) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, onClose]);
}


export default useOutsideClick
