export class FloatingEquipment {
    private xBaseSpeed: number
    private yBaseSpeed: number
    private zBaseSpeed: number
    private xSpeedDecreaseFactor = 0.005
    private ySpeedDecreaseFactor = 0
    private zSpeedDecreaseFactor = 0

    private readonly xSpeedDecreaseFactorSub = 0.000021
    private readonly ySpeedDecreaseFactorSub = 0.000021
    private readonly zSpeedDecreaseFactorSub = 0.000021

    private readonly xSpeedDecreaseFactorBaseLine = 0.0022
    private readonly ySpeedDecreaseFactorBaseLine = 0.0022
    private readonly zSpeedDecreaseFactorBaseLine = 0.0022

    constructor(public object: THREE.Group<THREE.Object3DEventMap>, private xSpeed: number, private ySpeed: number, private zSpeed: number) {
        this.xBaseSpeed = xSpeed
        this.yBaseSpeed = ySpeed
        this.zBaseSpeed = zSpeed
    }

    rotate() {
        this.object.rotation.x += this.xSpeed
        this.object.rotation.y += this.ySpeed
        this.object.rotation.z += this.zSpeed

        this.normalizeSpeed()
    }

    clicked() {

        if (this.xBaseSpeed > 0) {
            this.xSpeed = this.getRndSpeedChange(2, 3)
        }
        if (this.yBaseSpeed > 0) {
            this.ySpeed = this.getRndSpeedChange(2, 3)
        }
        if (this.zBaseSpeed > 0) {
            this.zSpeed = this.getRndSpeedChange(2, 3)
        }
    }

    private getRndSpeedChange(min: number, max: number) {
        return (Math.floor(Math.random() * (max - min + 1)) + min) / 50;
    }

    private normalizeSpeed() {
        if (this.xSpeed > this.xBaseSpeed) {
            this.xSpeed -= this.xSpeedDecreaseFactor
            if (this.xSpeedDecreaseFactor > 0) {
                this.xSpeedDecreaseFactor -= this.xSpeedDecreaseFactorSub
            } else {
                this.xSpeedDecreaseFactor = this.xSpeedDecreaseFactorBaseLine
            }
        } else {
            this.xSpeed = this.xBaseSpeed
        }

        if (this.ySpeed > this.yBaseSpeed) {
            this.ySpeed -= this.ySpeedDecreaseFactor
            if(this.ySpeedDecreaseFactor > 0) {
                this.ySpeedDecreaseFactor -= this.ySpeedDecreaseFactorSub
            } else {
                this.ySpeedDecreaseFactor = this.ySpeedDecreaseFactorBaseLine
            }
        } else {
            this.ySpeed = this.yBaseSpeed
        }

        if (this.zSpeed > this.zBaseSpeed) {
            this.zSpeed -= this.zSpeedDecreaseFactor
            if(this.zSpeedDecreaseFactor > 0 && this.zSpeedDecreaseFactor > this.zSpeedDecreaseFactorBaseLine) {
                this.zSpeedDecreaseFactor -= this.zSpeedDecreaseFactorSub
            } else {
                this.zSpeedDecreaseFactor = this.zSpeedDecreaseFactorBaseLine
            }
        } else {
            this.zSpeed = this.zBaseSpeed
        }
    }
}