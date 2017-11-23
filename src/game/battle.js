import { unitTypes } from '../constants';

const counterEfficiency = 1;
const exponent = 1;
/**
 * This map shows the battle coefficients between unit types.
 * - Rifle beats Rocket
 * - Rocket beats Tank
 * - Tank beats Rifle
 */
const efficiencyMap = {
	[unitTypes.RIFLE]: {
		[unitTypes.RIFLE]: 1,
	}
};
/**
 * Resolves a battle according to Lanchaster's square law.
 * @param attacker {{ unitType, unitCount }}
 * @param defender {{ unitType, unitCount }}
 */
export function resolveBattle(attacker, defender) {
	const p1 = efficiencyMap[attacker.unitType][defender.unitType];
	const p2 = efficiencyMap[defender.unitType][attacker.unitType];
	
	const N1 = attacker.unitCount;
	const N2 = defender.unitCount;
	
	const n1 = calculateForcesRemainingSquared(N1, N2, 0, p1, p2);
	const n2 = calculateForcesRemainingSquared(N2, N1, 0, p2, p1);
	
	// Attacker won
	if (n1 > 0) return { attacker: Math.round(Math.pow(n1, 1 / exponent)), defender: 0 };
	
	// Defender won
	if (n2 > 0) return { attacker: 0, defender: Math.round(Math.pow(n2, 1 / exponent)) };
	
	// Tie, both forces wiped out
	if (n1 === 0 && n2 === 0) return { attacker: 0, defender: 0 };
	
	// We should never get here.
	throw new Error('Unexpected battle outcome, there must be an error in the math or coefficients');
}

const exp = v => Math.pow(v, exponent);

/**
 * Returns the squared value of the remaining forces after a battle. A negative value indicates
 * that the reference army is wiped by the opposing army.
 * 
 * In case you want to simulate a battle to death, simulate the remaining forces for both armies
 * while specifying n2=0 in both cases. Use the case where n1>0; opposing army is wiped out.
 * 
 * @param N1 Start size of army for which we're calculating the remaining forces
 * @param N2 Start size of the opposing army
 * @param n2 "target" remaining forces of the opposing army. (0 for a battle to death)
 * @param p1 Battle efficiency of reference army
 * @param p2 Battle efficiency of opposing army
 * @returns {number} n1; the remaining unit count of the reference army
 */
function calculateForcesRemainingSquared(N1, N2, n2, p1, p2) {
	return exp(N1) - (exp(N2) - exp(n2)) * (p2 / p1);
}
