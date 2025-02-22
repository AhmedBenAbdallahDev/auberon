import styles from "./style.module.scss";
import { motion } from "framer-motion";
import { links, footerLinks } from "./data";
import Image from "next/image";
import { perspective, slideIn } from "./anim";
import clsx from "clsx";

export default function index() {
	return (
		<div className={styles.mainNav}>
			<div className={styles.nav}>
				<div className={clsx(styles.body)}>
					{links.map((link, i) => {
						const { title, href } = link;
						return (
							<div key={`b_${i}`} className={styles.linkContainer}>
								<motion.div
									href={href}
									custom={i}
									variants={slideIn}
									initial="initial"
									animate="enter"
									exit="exit"
								>
									<a>{title}</a>
								</motion.div>
							</div>
						);
					})}
				</div>
				<motion.div className={styles.footer}>
					{footerLinks.map((link, i) => {
						const { title, href } = link;
						return (
							<motion.a
								variants={slideIn}
								custom={i}
								initial="initial"
								animate="enter"
								exit="exit"
								key={`f_${i}`}
							>
								{title}
							</motion.a>
						);
					})}
				</motion.div>
			</div>
		</div>
	);
}
