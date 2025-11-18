import GlassSurface from '@/components/GlassSurface';
import Plasma from '@/components/Plasma';
import TextType from '@/components/TextType';

const Home = () => {
  return (
    <div className="absolute inset-0">
      {/* background layer */}
      <div className="absolute inset-0" style={{ width: '100%', height: '100%' }}>
        <Plasma
          color="#d7a1e7ff"
          speed={0.6}
          direction="forward"
          scale={1.5}
          opacity={0.8}
          mouseInteractive={false}
        />
      </div>

      {/* content layer - use flex and h-full to ensure content is vertically centered */}
      <div className="relative flex flex-col items-center justify-center h-full">
        <TextType
          text={['I AM SHENGTONG JIN', 'Welcome to my page!', 'Happy coding!']}
          typingSpeed={50}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
          className="text-4xl md:text-6xl font-bold font-anton mb-20 text-foreground"
        />
        <GlassSurface
          width={200}
          height={50}
          borderRadius={50}
          backgroundOpacity={0.05}
          className="my-custom-class text-mono font-bold"
        >
          <h2>Front-End Developer</h2>
        </GlassSurface>
      </div>
    </div>
  );
};

export default Home;
