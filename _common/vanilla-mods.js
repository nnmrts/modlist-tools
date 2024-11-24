import { list } from "@radashi-org/radashi";

const vanillaMods = new Map([
	[
		"starfield",
		[
			{
				id: 0,
				files: [
					{
						enabled: true,
						path: "Starfield.esm",
						requirements: [],
						tags: []
					}
				],
				filesOnly: true,
				name: "Starfield",
				requirements: [],
				summary: "",
				tags: ["Main Plugins"]
			},
			...list(
				1,
				999,
				(number) => {
					const name = `SFBGS${String(number).padStart(3, "0")}`;

					return {
						id: -number,
						files: [
							{
								enabled: true,
								path: `${name}.esm`,
								requirements: [],
								tags: []
							}
						],
						filesOnly: true,
						name,
						requirements: [],
						summary: "",
						tags: ["Main Plugins"]
					};
				}
			),
			{
				id: -1_000,
				files: [
					{
						enabled: true,
						path: "Constellation.esm",
						requirements: [],
						tags: []
					},
					{
						enabled: true,
						path: "Constellation - Localization.ba2",
						requirements: [],
						tags: []
					},
					{
						enabled: true,
						path: "Constellation - Textures.ba2",
						requirements: [],
						tags: []
					}
				],
				name: "DLC: Constellation",
				requirements: [],
				summary: "An exclusive bonus for Premium and Constellation Editions of Starfield. Customize your Spacesuit, Space Helmet, Pack, and Equinox with the Constellation Skin at workbenches.",
				tags: ["Main Plugins"]
			},
			{
				id: -1_001,
				files: [
					{
						enabled: true,
						path: "OldMars.esm",
						requirements: [],
						tags: []
					}
				],
				name: "DLC: OldMars",
				requirements: [],
				summary: "A pre-order and Xbox Game Pass bonus for Starfield. Customize your Deep Mining Space Helmet, Pack, and Cutter with the Old Mars Skin at workbenches.",
				tags: ["Main Plugins"]
			},
			{
				id: -1_002,
				files: [
					{
						enabled: true,
						path: "ShatteredSpace.esm",
						requirements: [],
						tags: []
					},
					{
						enabled: true,
						path: "ShatteredSpace - Main01.ba2",
						requirements: [],
						tags: []
					},
					{
						enabled: true,
						path: "ShatteredSpace - Main02.ba2",
						requirements: [],
						tags: []
					},
					{
						enabled: true,
						path: "ShatteredSpace - Textures.ba2",
						requirements: [],
						tags: []
					},
					{
						enabled: true,
						path: "ShatteredSpace - Voices_en.ba2",
						requirements: [],
						tags: []
					}
				],
				name: "DLC: ShatteredSpace",
				requirements: [],
				summary: "Uncover the secrets of House Va’Ruun’s hidden homeworld, Va’Ruun’kai, as you face a cosmic threat and navigate their complex history. Shape the faction’s future while discovering new weapons, spacesuits, and gear in this Starfield expansion.",
				tags: ["Main Plugins"]
			},
			{
				id: -1_003,
				files: [
					{
						enabled: true,
						path: "BlueprintShips-Starfield.esm",
						requirements: [],
						tags: []
					}
				],
				filesOnly: true,
				name: "BlueprintShips-Starfield",
				requirements: [],
				summary: "",
				tags: ["Main Plugins"]
			}
		]
	]
]);

export default vanillaMods;
