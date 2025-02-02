import shajs from 'sha.js';

export const defaultReactiveHashCharacterSet = 'bdhmnqvz';
const defaultReactiveHashLength = 5;

type GenerateReactiveHashProps = {
	purpose: string;
	versionNumber: number;
	secret: string;
	characterSet?: string;
	length?: number;
};
export function generateReactiveHash({
	purpose,
	versionNumber,
	secret,
	characterSet,
	length,
}: GenerateReactiveHashProps) {
	const rawReactiveHashNumber = BigInt(
		`0x${shajs('sha256')
			.update(`${purpose}${versionNumber}${secret}`)
			.digest('hex')}`
	);

	const reactiveHashCharacterSet =
		characterSet ?? defaultReactiveHashCharacterSet;

	const base = BigInt(reactiveHashCharacterSet.length);
	const lastDigits = [];
	const hashLength = BigInt(length ?? defaultReactiveHashLength);
	console.log(rawReactiveHashNumber);
	for (let i = hashLength - 1n; i >= 0; i -= 1n) {
		lastDigits.push((rawReactiveHashNumber / base ** i) % base);
	}

	const reactiveHash = lastDigits
		.map((digit) => reactiveHashCharacterSet.charAt(Number(digit)))
		.join('');

	return reactiveHash;
}

type GenerateReactiveEmailProps = {
	domain: string;
	purpose: string;
	versionNumber: number;
	reactiveHashSecret: string;
	reactiveHashOptions?: Omit<
		GenerateReactiveHashProps,
		'purpose' | 'versionNumber' | 'secret'
	>;
};
export function generateReactiveEmail({
	purpose,
	versionNumber,
	reactiveHashSecret,
	reactiveHashOptions,
	domain,
}: GenerateReactiveEmailProps) {
	const reactiveHash = generateReactiveHash({
		purpose,
		versionNumber,
		secret: reactiveHashSecret,
		...reactiveHashOptions,
	});
	return `${purpose}${versionNumber}${reactiveHash}@${domain}`;
}
