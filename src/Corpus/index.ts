export default class Corpus {
	source: string[] = [];
	vocab: string[] = [];
	data: Record<string, Record<string, number>>[] = [];
	maxMemory = 5;

	eat(input: string) {
		return input
			.replace(/[^a-zA-Z ]/g, "")
			.replace(/\s+/g, " ")
			.split(" ")
			.filter(e => e.length)
			.map(e => e.toLocaleLowerCase());
	}

	populate(input: string) {
		this.eat(input).forEach(e => {
			this.source.push(e);
			if (!this.vocab.includes(e)) this.vocab.push(e);
		});
		return this;
	}

	learn() {
		for (let i = 0; i < this.maxMemory; i++) {
			const memory = {};
			for (let j = 0; j < this.source.length - i - 1; j++) {
				const s = this.source.slice(j, j + i + 1).join("");
				memory[s] = memory[s] ?? {};
				this.vocab.forEach((v) => {
					if (v === this.source[j + i + 1]) {
						if (memory[s][v]) memory[s][v]++;
						else memory[s][v] = 1;
					}
				})
			}
			this.data[i] = memory;
		}
		return this;
	}

	predict(input: string) {
		const full = this.eat(input).slice(-5);
		const predictions: Record<string, number>[] = [];
		while (full.length) {
			Object
				.entries(this.data[full.length - 1][full.join("")] ?? {})
				.sort(([_v1, c1], [_v2, c2]) => {
					return c2 - c1;
				})
				.forEach(([v, c]) => {
					predictions.push({ [v]: c });
				});
			full.shift();
		}
		return predictions;
	}
}