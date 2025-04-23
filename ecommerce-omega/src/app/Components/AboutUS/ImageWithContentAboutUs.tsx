import Link from "next/link";
export default function ImageWithContentAboutUs() {
    return (
        <section className="">
            <div className="mx-auto gowun-batang-regular max-w-screen-xl px-4 py-[7rem] sm:py-[8rem] sm:px-6 lg:py-[15rem] lg:px-8 pb-[0rem]">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
                <div className="relative h-[20rem] overflow-hidden rounded-lg sm:h-[25rem] lg:h-full">
                        <img
                            className="h-[90%] rounded-lg w-full object-cover "
                            src="/team.jpg"
                            alt="can_help_banner"
                        />
                    </div>
                    <div className="lg:py-24">
                        <h2 className="text-4xl uppercase text-black font-bold">
                            Our Story
                        </h2>

                        <p className="mt-4 text-base text-gray-700">
                            Visual Peephole LLC is a premier visualization studio specializing in architectural and engineering projects. Headquartered in Miami, FL, with sales representatives in Plano, TX, and San Francisco, CA, we are dedicated to delivering the highest quality visualization services.
                            <br />
                            <br />
                            As a team of artists committed to good taste and quality, we bring a refined aesthetic and meticulous attention to detail to every project. Our experienced professionals provide tailored solutions for the architecture, real estate, and design industries. Whether you’re aiming to impress potential investors, bring your design concepts to life, or elevate project presentations, Visual Peephole is here to help you succeed with unmatched expertise and creativity.
                        </p>
                        <div className="mt-12 mb-10 text-center">
                            <Link
                                title="link"
                                href="/Contacto"
                                className="inline-block rounded bg-gray-400 px-[4rem] py-3 text-sm font-medium text-white transition hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-500"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
