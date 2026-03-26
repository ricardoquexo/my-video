import "./index.css";
import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { PassoAPassoPata } from "./PassoAPassoPata";
import { BeiraRioVideo, calculateBeiraRioMetadata } from "./BeiraRioVideo";
import { DiscDepotVideo } from "./DiscDepot/DiscDepot";
import { AnimatedChart } from "./AnimatedChart";
import { ValorizacaoChart } from "./ValorizacaoChart";
import { PataVideo } from "./PataVideo";
import { PataFluxo } from "./PataFluxo";
import { LoadingTake } from "./LoadingTake";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LoadingTake"
        component={LoadingTake}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PataVideo"
        component={PataVideo}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PataFluxo"
        component={PataFluxo}
        durationInFrames={660}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PassoAPassoPata"
        component={PassoAPassoPata}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BeiraRioVideo"
        component={BeiraRioVideo}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={calculateBeiraRioMetadata}
        defaultProps={{
          videoDurations: [],
        }}
      />
      <Composition
        id="DiscDepotVideo"
        component={DiscDepotVideo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AnimatedChart"
        component={AnimatedChart}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1350}
      />
      <Composition
        id="ValorizacaoChart"
        component={ValorizacaoChart}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1350}
      />
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />
    </>
  );
};
