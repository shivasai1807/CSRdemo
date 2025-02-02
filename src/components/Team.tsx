import React from 'react';
import { Linkedin, Instagram } from 'lucide-react';

const teamMembers = [
  {
    name: 'Vinil Reddy',
    role: 'Licensee',
    image: 'https://media-hosting.imagekit.io//a461bbeda11d4649/Screenshot%202025-01-28%20at%2018.10.36.png?Expires=1832676059&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=DeGUweq~0HdbLYvmsjBG6et3YOfQcl5iGFhhSvtKrpf7l-G1gBXEcQJfDRL~tunUyIaVJkWVxPeVgai5P1UNc5knf4tzgwIRhJqKo1dBi6z1krwPNSL69qetPLnjU52YX9wczBoi0zZZWnx4IHibfYm33ELwZrcWM1XLbk9NHXoy2a1~rLuiJmd7HJ9e5sIKKuNmisiarHbWgF0siCMdtbtxlVU0zsosglbZR7WHuT-1U-URgEwHme9~Ic5fcIWavRK0cuUlrr04DXG9GYQpgQjh8klQRR9sLG2zv0kiRTi-RXpT0i-SNe9nJ48ku20~gB0n-lDnY7V-M77wvNtk9A__',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com'
  },
  {
    name: 'Sai Yashwanth Simhadri',
    role: 'Director',
    image: 'https://media-hosting.imagekit.io//0d91eb55694a41fe/Screenshot%202025-01-28%20at%2018.12.56.png?Expires=1832676188&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=MYNI~rillfO14SkQa8zeok7qrqzAKFt66Y0Q1azuOABlcU45vRFoztTfeIyOEznHfKpp-twntgo4iwjTrRIlYZEX-DZbDGGcvdipRLe~7a8vlKl7QCIgynVNvHvK1Rja93G-iSbSzoyj8s5A1xSAhBhTcxhbJuyELeK6aLYo4tonc270iqwBKwSWRJb5uy8OrrBKA~P6FjxpgDVgovauyxx6F7n4SZOH1XhH6o7s5GdFHnDtaZnMhebnIYnrhOwI~fVDCyzAo0TQErl-P4avuSrUnEVqoE~7YGrEdvqU3ZO2uelKJWHoKFgjxtZec1TqPUy-IwQb-ZX7rIj6xH7FxA__',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com'
  },
  {
    name: 'Jilla Sai Nandhan',
    role: 'Director-Strategy & event operations',
    image: 'https://media-hosting.imagekit.io//e7d6275f768e4cad/Screenshot%202025-01-28%20at%2018.16.16.png?Expires=1832676387&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kM~ZhBgw3eJynI-o2GzDmlYyeyjg8UeWshvCUO85eJTxzPABqwMeHfmesnuGg8~cEbNYsfYjRXJy8mhDMXX7gujdq1gY5YYusL~mX6h9mjiaPWrTLZCreN4DBi9obHyca-s2fCsNLsFKcp4vLU437rOOeX5Gf0u~2yT90xk3tYPmKY~xC0Po58nqrkyRsbeRBq4vJUyjd1gMJqgfKiErmYCerXQqUq~uFo2LZyU8yueT5brm0~6Y-~tvVIyihLpADeGPX9inXzXpxCt~DCajLez9VmUsowh3P5oI59wnSlaNcZBeqAZAKVYX8hn8QJhTzn~THWLwQMaAaUB2h1qtLw__',
    linkedin: 'https://www.linkedin.com/in/sainandhan-jilla-21a816224/',
    instagram: 'https://instagram.com'
  },
  {
    name: 'Raaga Samanvita',
    role: 'sponsorship relations ',
    image: 'https://media-hosting.imagekit.io//e34b7d29819f49e1/Screenshot%202025-01-28%20at%2018.14.51.png?Expires=1832676302&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=zcHBKq3Za3crJWonlcCibualGN9dqkh26j3T4Rd~FGREaVkqk9JWxhOUH0nAOzME-RrZIRJTBrCfzm-GAAzTHHJWjytGkeUelTcaXl9LoH6bn6w-Epj-kz9tMvCB7pO3~lWnGEPIxzYEPWCpr5karpiYdcd6UK9Tlc3i~FsEJXB8vItS~jtaJ-yd1Ohce2XISz5miQCXFDtDeK4VaUVqwrZttI6kuo43Ye0Yzk0WZwalENF61lyYxpqlAOen2BQxqHMAtGxl-Envt4W5PSmXjxFo-hYkvbaJzMWdxujVUgkWfhJbSQj-s4zw6p26TnhFhC2uGBrHM78MbLAwKldqmg__',
    linkedin: 'https://www.linkedin.com/in/burra-raaga-samanvita/',
    instagram: 'https://instagram.com'
  },
  {
    name: 'Pranav Kothapalli',
    role: 'Branding and Communications manager',
    image: 'https://media-hosting.imagekit.io//18112926e0324fdd/Screenshot%202025-01-28%20at%2018.22.40.png?Expires=1832676785&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=l2Zcs11NTm7IQLcI2MBVIDshDvge-IxQseD2hJYN80qyua2ePk-hKhNRONnVn-jaKIQjCDEVHJjYkIgJKu33vTFZh~RVGx2hp6N489kqGg60Y8QAoR8X8HSi8Q0ohskqeA3gYdavBbZGz3Mdf0PkZM3ChTBVaALg7JNqHQnuTFTrR9kyYlXllGrxUMTNgLhstaTP9MVOHlQ1qRoJQuStHzCOg6IO1TYit~i-p52eCy2OFGOFOZLbfmReInKQIRnM2qFNe1xbNsbsYTvlJiVTIrUlCzuEcUl3HB9PB87E85NhPZyvtOwSyOVsCP-x9Bia0yZCT2FbNIapvraQTdenhA__',
    linkedin: 'https://www.linkedin.com/in/pranavkothapalli/',
    instagram: 'https://instagram.com'
  },
    {
    name: 'Aishwarya Alechalla',
    role: 'Content lead & program manager',
    image: 'https://media-hosting.imagekit.io//1c56c33e2fd841ba/Screenshot%202025-01-28%20at%2018.20.53.png?Expires=1832676670&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=jC0xOt6fpfiLxtFT94F3cKbC7-geBDjiuEyTpXzGJlU3HYKNkWGzxh9mwfOke709UFcRx6B5Zlvz7YsbulsQAJrestJJqT12SGPDQcYihA1LlOt-zfDaNOY9qltqn5tU5L0qEMfrnABd~Ph8-nr1wFzNY7tNPngIG8q5bM2NvBdyBvE8FgjB-syAijMJet6slltCLPY0XMV7u~fqHgRe7GSw-3ImMzXfaA8pxTiWtHR-yKYMENVzPu7kvbH33IdNSMSSEe8qmdhv2aZlydBAOokdS0wSaEt3bB3wCa9jTFeJWjtSXgrRj-7cSAO3tzu85CbIMdwp8hsCEDT3kI3c6g__',
    linkedin: 'https://www.linkedin.com/in/aishwaryaalechalla/',
    instagram: 'https://instagram.com'
  }
];

export function Team() {
  return (
    <div className="content-section">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12 section-title text-gradient text-center">Our Core Team</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="team-member-card rounded-xl overflow-hidden"
            >
              <div className="relative">
                <div className="flex">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-5/6 h-80 object-cover"
                  />
                  <div className="w-1/6 bg-white flex flex-col items-center justify-center space-y-4">
                    <a 
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-[#BBD921] rounded-full transition-colors duration-300 group"
                    >
                      <Linkedin className="w-6 h-6 group-hover:text-white" />
                    </a>
                    <a 
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-[#BBD921] rounded-full transition-colors duration-300 group"
                    >
                      <Instagram className="w-6 h-6 group-hover:text-white" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="content p-6 bg-white">
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}