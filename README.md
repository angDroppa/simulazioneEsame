- `/` con `return null`: la pagina non mostra nulla perché il middleware intercetta prima e smista verso `/dashboard` o `/login`
- Se l'app ha una landing pubblica: `ROOT_IS_PRIVATE = false` e `/` contiene il suo contenuto normale
- Il flag `ROOT_IS_PRIVATE` nel middleware controlla questo comportamento — commentarlo o cambiarlo a `false` per passare da app privata a pubblica



import { randomBytes } from "crypto";

export function generateKey() {
  return randomBytes(16).toString("hex");
}

per indirizzi 

https://nominatim.openstreetmap.org/search?q=via+roma&countrycodes=it&format=json&addressdetails=1&limit=5