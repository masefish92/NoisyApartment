export type Category = "sleep" | "work" | "live";

export type Product = {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  category: Category;
  categoryLabel: string;
  description: string;
  image: string;
  alt: string;
  bestseller?: boolean;
};

export const products: Product[] = [
  {
    id: "soma-soundscape",
    name: "Soma Soundscape",
    price: 149,
    priceLabel: "$149",
    category: "sleep",
    categoryLabel: "Sleep Better",
    description:
      "Adaptive white noise frequency modulation housed in a hand-crafted walnut shell.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCLI4ih0HO7tPaEQOw0ClNPI0xKRjCwRyvHzS-ADT949vmlxD3r0SGmWsIW7t3xiXJP1wS-Chk_4fSVND2oXvUZDsLeo1mym4stwG4_vkwA4yF19QLnoQLXYOoUwwDGpo4Z5fmmHycgO3507mgHd9A3_H1oeFSEAovX16sesutI0JQPoRHb3L295Uq4Cc2EjdSn0eM9kOjs54kzO99xNRV0GjAGAPNNI71Bm47ixSmPU2_D1rIaNyi3",
    alt: "Minimalist white noise machine with a natural oak base and fabric-covered speaker top.",
    bestseller: true,
  },
  {
    id: "focus-flow-gen-2",
    name: "Focus Flow Gen 2",
    price: 399,
    priceLabel: "$399",
    category: "work",
    categoryLabel: "Work Better",
    description:
      "Active noise cancellation specifically tuned for urban apartment echoes and office chatter.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAwwizfe0x4c0mGvqXmSXzANnrCOa145fIfJoDuqWct10EUSMzKX0K9jpFKvnwl4htLfy2naLjkwHj9nKp8kbQTPCWXg0NyMbUVF2LpgHG7dDsEI_trO1Nmpe6uCpbZveJr7QqTqCDG9yYsaWAo7lO3Eer_2HDiXcS7cXqPri8ED-B70ld9R_ab7m9WHOd0ywp4d1ax-4GSWpyMI-mKh4440BK_8A_KJ-TYskxmnHPh9DDC_oasn2Wo",
    alt: "Matte deep-teal ANC headphones folded next to a designer fountain pen and leather notebook.",
  },
  {
    id: "grid-wall-panels",
    name: "Grid Wall Panels",
    price: 280,
    priceLabel: "$280 / Set",
    category: "live",
    categoryLabel: "Live Better",
    description:
      "Felted wool absorption modules designed by structural engineers and mid-century architects.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAOm407BYnsI6b4jhjHMEuJz-p2CyO0M3stxcFFIesQmCr3dtddlmIFP5yNT_Ci2_r_gS7MhNGvW17PIwbINfaTtMqStq4LHTLsb8GWnbaV7ELrWIi_jc6YybNdfgG29BrAVZI5V4miL2u12I3qKf6H_Mm2m0peUx25KAoR-F-UqGznSKvbG3s3MknDtg4RraGBEMD5kTPIEPuorUNWj6Xo_6CtE9nRc3xASM9ZRgfiu-AB1IvuLPq3",
    alt: "Geometric acoustic wall panels in muted mustard, teal, and cream above a mid-century credenza.",
  },
  {
    id: "quiet-core-buds",
    name: "Quiet Core Buds",
    price: 24,
    priceLabel: "$24",
    category: "sleep",
    categoryLabel: "Sleep Better",
    description:
      "Medical-grade silicone with a dual-stage filter for 32dB of consistent sound reduction.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDaNS3lQYZZ6T8lomTswwqr9sN6x8sur07q9T-JQcY7xiVUiOidoKS5jnKcOMvDh5GSnM_XoWbBXyZsUiC-UdYl_AnAhHDzSlowQXOXzEtjQvpHVT0RvOVFJc1mYnOwCaTnKkJpzWLv6zEFc_dsW9RiVejFNaK9HxnPEDMEcMGzShGCxUT_J2V_m2JC_xnTYF95jW4py_GATT3whNLGUYRuTjxgJWlX1W5uM9f_sG-8pF7bPyGikLa7",
    alt: "Macro shot of terracotta silicone earplugs in a brass carrying case on white marble.",
  },
  {
    id: "basalt-rug",
    name: "Basalt High-Pile Rug",
    price: 750,
    priceLabel: "$750",
    category: "live",
    categoryLabel: "Live Better",
    description:
      "Heavyweight New Zealand wool weave specifically calibrated for sub-bass vibration dampening.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCgFaFlKp0chL5xIw37z1KAN0vB5TpXL0t8Gy10HTPINXBqBvaWTtLpZySn5Wnvh35dVZkLi_8FVpc-r7Ayht_pGlYTbbwKKwHuqpr85Lwa8CFJ7-rk_CVd4M3J1TLBPBD9rZl95oRZpd36V8rdreIG0ZeHjIOuB2a-yM-ntb8dCp6aDmULPAo62vVecMPWA0FRLcuwLSbaZyrlDXouyTPJFanoqn7Yd8kYRuBwde_7125YRcWlHeVj",
    alt: "Plush wool rug with a subtle geometric pattern in walnut and cream on an oak floor.",
  },
  {
    id: "nook-desk-screen",
    name: "Nook Desk Screen",
    price: 185,
    priceLabel: "$185",
    category: "work",
    categoryLabel: "Work Better",
    description:
      "Recycled PET acoustic felt that clamps to any surface to create a portable cone of silence.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC9BooXECDPsUw_GRZ4qFjATwvrccYFPK1P__C7ZaD1IhLGsP9hzZ5p14_6Q5II02AEhtqsulKgrQaaGKIs1H0E2MPSZFU7AiTgl7Az4KaVfnf1dA0gRuT5cBLAq0351dwT9iqqmf-0-2N0w-GqlDHowZVB8yLsKWZDe64fxfeNExqt02y03i-RBT975h0O-R_H0xPasPtew2WmV_6UmyBSpRBuv8MA7cW8ItWSn78u9Mr5iX_OBPLV",
    alt: "Charcoal felt acoustic desk partition clamped to a light wood desk beside a monitor.",
  },
];
