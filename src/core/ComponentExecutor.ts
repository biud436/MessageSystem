export type Executuor = () => void;

interface DataLinkSet {
    callbackFunction: Executuor;
    active: boolean;
}

/**
 * @class ComponentExecutor
 * @author biud436
 * @description
 * ComponentExecutor는 컴포넌트를 샌드박스 환경에서 안전하게 실행합니다.
 * 샌드박스 환경이라는 것은 주요 메서드가 외부와 차단되어, 예외 처리를 통하여 각종 오류를 캐치할 수 있게 합니다.
 */
export default class ComponentExecutor {
    public static INSTANCE: ComponentExecutor;
    private _components: Record<string, DataLinkSet> = {};
    private _order: string[] = [];

    public static getInstance(): ComponentExecutor {
        if (!ComponentExecutor.INSTANCE) {
            ComponentExecutor.INSTANCE = new ComponentExecutor();
        }
        return ComponentExecutor.INSTANCE;
    }

    public constructor() {}

    public add(name: string, func: Executuor): ComponentExecutor {
        if (name === "") {
            let startChar = 97; // a
            let endChar = 122; // z
            let len = 7; // length of random string

            for (let i = 0; i < len; i++) {
                name += String.fromCharCode(
                    Math.floor(Math.random() * (endChar - startChar)) +
                        startChar
                );
            }
        }

        this._components[name] = <DataLinkSet>{
            callbackFunction: func,
            active: false,
        };

        this._order.push(name);

        return this;
    }

    public wrap(name: string, func: Executuor): ComponentExecutor {
        return this.add(name, func);
    }

    public inject(name: string, func: Executuor): ComponentExecutor {
        this.add(name, func);
        this.active(name);

        return this;
    }

    public get(name: string): Executuor {
        const prop = this._components[name];

        return prop.callbackFunction;
    }

    public active(name: string): ComponentExecutor {
        const prop = this._components[name];

        prop.active = true;

        return this;
    }

    public deactive(name: string): ComponentExecutor {
        const prop = this._components[name];

        prop.active = false;

        return this;
    }

    public ready(name: string): ComponentExecutor {
        return this.active(name);
    }

    public executeAll() {
        try {
            for (const key of this._order) {
                const prop = this._components[key];

                console.log(key);

                if (prop.active) {
                    const currentCallback = this.get(key);

                    if (currentCallback instanceof Function) {
                        currentCallback();
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
}
