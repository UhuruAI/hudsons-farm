import Image from "next/image";

const GPS = "-25.890432,27.449568";

export default function SanctuaryMap({ showEmbed = true }: { showEmbed?: boolean }) {
  return (
    <div className="sanctuary-map">
      <figure className="map-figure" data-reveal>
        <Image
          src="/images/revayah-masterplan.jpg"
          alt="Illustrated master plan of Revayah Sanctuary showing the Heritage Centre and amphitheatre, Integrated Farming System, Hemp Training Academy, Eco-Resort, and the Revival Hub"
          width={1920}
          height={1072}
          sizes="(max-width: 880px) 100vw, 1100px"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        <figcaption>
          The Revayah Sanctuary master plan — five pillars on 12 hectares: Heritage Centre &amp;
          Amphitheatre, Integrated Farming System, Hemp Training Academy, Eco-Resort, and the
          Revival Hub.
        </figcaption>
      </figure>

      <div className="map-address" data-reveal>
        <div>
          <strong>Portion 30, Boschfontein No. 387</strong>
          <span>Maanhaarrand, North West Province, South Africa</span>
          <span className="map-gps">GPS {GPS}</span>
        </div>
        <a
          className="btn btn-ghost"
          href={`https://www.google.com/maps/dir/?api=1&destination=${GPS}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Directions
        </a>
      </div>

      {showEmbed && (
        <div className="map-embed" data-reveal>
          <iframe
            title="Revayah Sanctuary satellite map"
            src={`https://maps.google.com/maps?q=${GPS}&z=15&t=k&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </div>
  );
}
