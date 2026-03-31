import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Grainient from "@/components/Grainient";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Grainient Background */}
      <div className="absolute inset-0">
        <Grainient
          color1="#D64A86"
          color2="#D6A07A"
          color3="#C73A78"
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl font-bold tracking-tight text-primary-foreground md:text-7xl lg:text-8xl"
          >
            Design Your
            <br />
            <span className="italic">Dream Jewelry</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mx-auto mt-6 max-w-xl font-body text-lg text-primary-foreground/80 md:text-xl"
          >
            Craft your unique piece by combining exquisite elements.
            Drag, drop, and create something truly yours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10"
          >
            <button
              onClick={() => navigate("/customize")}
              className="group relative inline-flex items-center gap-3 rounded-full px-10 py-4 font-body text-lg font-semibold text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_60px_-10px_rgba(214,74,134,0.5)]"
              style={{
                background: "linear-gradient(135deg, #D6A07A, #D64A86, #C73A78)",
              }}
            >
              <span>Customize Now</span>
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
