
import Link from "next/link";
export default function ImageWithContentAboutUs2() {
    return (
        <section className="pt-[0rem]">
            <div className="mx-auto gowun-batang-regular max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:py-16 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
                    <div className="relative h-[20rem] overflow-hidden rounded-lg sm:h-[25rem] lg:h-full">
                        <img
                            className="h-[90%] rounded-lg w-full object-cover "
                            src="/vpLogo.png"
                            alt="can_help_banner"
                        />
                    </div>
                    <div className="lg:py-24">
                        <h2 className="text-4xl uppercase text-black font-bold">
                            The Vision We Pursue
                        </h2>
                        <p className="mt-4 text-base text-gray-700">
                            At Visualpeephole LLC, we are driven by innovation and a relentless pursuit of excellence. Our commitment to exceeding client expectations ensures that every project is executed with meticulous care and precision. We focus on delivering exceptional results, leveraging cutting-edge technology and industry expertise to bring your vision to life. Join us on our journey to redefine engineering and design excellence.
                            <br />
                            <br />
                            Our vision extends beyond just meeting project requirements; we aim to inspire and lead in the field of engineering and design. By fostering a culture of continuous improvement and embracing the latest advancements, we empower our clients to achieve their goals and set new standards in their industries.Partner with us to experience the future of design and engineering today.

                        </p><div className="mt-12 mb-10 text-center">
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
