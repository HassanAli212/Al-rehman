import { motion } from "framer-motion";


const badges = [

  {
    title: "100% Original Products",
    text: "Sourced and tested for genuine dairy-grade quality.",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="8" r="6" />
        <path d="M9 14l-2 7 5-3 5 3-2-7" />
      </svg>
    ),
  },


  {
    title: "Support 24/7",
    text: "Our team is here whenever you need help or advice.",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
  },


  {
    title: "7 Day Returns",
    text: "Not satisfied? Return it within 7 days, no hassle.",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 12a9 9 0 109-9" />
        <path d="M3 4v5h5" />
      </svg>
    ),
  },


  {
    title: "Secure Payments",
    text: "COD, JazzCash, EasyPaisa and card — all encrypted.",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },

];





const TrustBadges = () => (

  <section className="bg-ink-950 text-white py-12">


    <div className="
      max-w-6xl
      mx-auto
      px-5
      grid
      grid-cols-2
      md:grid-cols-4
      gap-8
    ">


      {badges.map((b, i) => (


        <motion.div


          key={b.title}


          initial={{
            opacity:0,
            y:25,
          }}


          whileInView={{
            opacity:1,
            y:0,
          }}


          viewport={{
            once:true,
            amount:0.3,
          }}


          transition={{
            duration:0.5,
            delay:i * 0.12,
            ease:[0.16,1,0.3,1],
          }}



          whileHover={{
            y:-8,
          }}


          className="
            text-center
            flex
            flex-col
            items-center
            cursor-default
          "


        >



          <motion.div


            whileHover={{
              scale:1.12,
              rotate:5,
            }}


            transition={{
              duration:0.25,
            }}



            className="
              w-14
              h-14
              rounded-full
              border
              border-white/25
              flex
              items-center
              justify-center
              mb-3
              text-brand-400
            "


          >

            {b.icon}


          </motion.div>






          <div

            className="
              font-display
              font-semibold
              text-sm
              md:text-base
              mb-1
            "

          >

            {b.title}


          </div>





          <p

            className="
              text-xs
              md:text-sm
              text-white/60
              leading-relaxed
              max-w-[180px]
            "

          >

            {b.text}


          </p>



        </motion.div>


      ))}



    </div>


  </section>

);


export default TrustBadges;