function updateFavicon(color) {
    const svg = `<?xml version="1.0" standalone="no"?>
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN"
        "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
        width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet">

        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
        fill="${color}" stroke="none">
        <path d="M2345 4974 c-123 -20 -250 -60 -361 -113 -342 -163 -588 -442 -709
        -804 -61 -182 -65 -232 -65 -819 l0 -526 -167 -4 c-190 -4 -218 -12 -285 -86
        -73 -81 -69 -2 -66 -1217 l3 -1091 26 -49 c28 -56 91 -109 147 -125 52 -14
        3332 -14 3384 0 56 16 119 69 147 125 l26 49 3 1091 c3 1215 7 1136 -66 1217
        -67 74 -95 82 -284 86 l-168 4 0 526 c0 587 -4 637 -65 819 -163 487 -574 838
        -1075 918 -115 18 -316 18 -425 -1z m404 -490 c271 -60 514 -267 615 -524 59
        -150 59 -151 63 -722 l4 -528 -871 0 -871 0 4 528 c3 498 5 531 25 607 109
        412 478 682 897 657 39 -2 99 -10 134 -18z m-35 -2523 c218 -107 260 -396 81
        -566 l-31 -30 24 -233 25 -233 -20 -27 -20 -27 -213 0 -213 0 -20 27 -20 27
        25 233 24 233 -31 30 c-79 75 -122 187 -111 288 25 245 280 387 500 278z"/>
        </g>
        </svg>
        `;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
    }
    link.href = url;
}

// Set favicon based on CSS variable
const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--var-primary-color").trim();
updateFavicon(primaryColor);