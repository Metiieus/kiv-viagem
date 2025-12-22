import { HazardPoint } from '../../../services/RiskEngine';

export interface SafetyEvent {
    hazard: HazardPoint;
    timestamp: number;
    entrySpeed: number; // km/h
    recommendedSpeed: number; // km/h
    scoreImpact: number; // Negative value
}

class SafetyMonitor {
    private events: SafetyEvent[] = [];
    private baseScore: number = 100;

    // Reset for new trip
    startTrip() {
        this.events = [];
        this.baseScore = 100;
    }

    // Log an interaction with a hazard
    logEvent(hazard: HazardPoint, currentSpeed: number) {
        // Only log if we haven't logged this hazard recently (dedup logic handled by caller or here)
        // For simplicity, caller handles "activeHazard" distinctness.

        let penalty = 0;
        const limit = hazard.recommendedSpeed || 60;

        if (currentSpeed > limit) {
            const excess = currentSpeed - limit;
            // Penalty Formula: 1 point per km/h over limit, multiplier by severity
            const multiplier = hazard.severity === 'critical' ? 2.0 : hazard.severity === 'high' ? 1.5 : 1.0;
            penalty = Math.round(excess * multiplier);
        }

        this.events.push({
            hazard,
            timestamp: Date.now(),
            entrySpeed: currentSpeed,
            recommendedSpeed: limit,
            scoreImpact: -penalty
        });

        console.log(`[SafetyMonitor] Event Logged: Speed ${currentSpeed} vs Limit ${limit}. Penalty: ${penalty}`);
    }

    getTripScore(): number {
        const totalPenalty = this.events.reduce((sum, e) => sum + e.scoreImpact, 0);
        return Math.max(0, this.baseScore + totalPenalty);
    }

    getReport(): string {
        const score = this.getTripScore();
        const infractions = this.events.filter(e => e.scoreImpact < 0).length;

        let grade = 'A';
        if (score < 90) grade = 'B';
        if (score < 70) grade = 'C';
        if (score < 50) grade = 'D';
        if (score < 30) grade = 'F';

        return `Score: ${score}/100 (Grade ${grade})\nEvents: ${this.events.length}\nInfractions: ${infractions}`;
    }
}

export const safetyMonitor = new SafetyMonitor();
