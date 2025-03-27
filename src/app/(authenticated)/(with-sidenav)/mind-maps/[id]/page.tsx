"use client"
import {
    addEdge,
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
    Panel,
    ReactFlow,
    useEdgesState,
    useNodesState,
} from "@xyflow/react"
import { useCallback } from "react"

import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import "@xyflow/react/dist/style.css"
import CustomNode from "./_components/custom-node"
import { convertItemsToNodes } from "./_utils/convert-to-nodes"

const nodeTypes = {
    customNode: CustomNode,
}

export default function App() {
    const { isSidenavOpen } = useSidenav()
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    )

    return (
        <div
            className={cn("h-[92vh] -mt-2 border border-gray-300 relative", {
                "w-[calc(100vw-306px)]": isSidenavOpen,
                "w-[calc(100vw-100px)]": !isSidenavOpen,
            })}
        >
            <ReactFlow
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Controls className="rounded-lg -translate-y-4 border border-gray-200" />
                <Panel position="bottom-right" className="bg-transparent">
                    <div className="rounded-lg shadow-lg overflow-hidden border border-gray-200">
                        <MiniMap
                            className="!bg-white/90 -translate-y-4 dark:!bg-gray-800/90"
                            style={{ height: 110, width: 170 }}
                            pannable
                            nodeBorderRadius={2}
                            nodeStrokeWidth={2}
                            nodeComponent={(nodeProps) => {
                                const { x, y, width, height } = nodeProps
                                return (
                                    <rect
                                        x={x}
                                        y={y}
                                        width={width}
                                        height={height}
                                        rx={4}
                                        className="fill-blue-400 dark:fill-blue-500 stroke-blue-400 dark:stroke-blue-400"
                                        strokeWidth={2}
                                    />
                                )
                            }}
                            maskColor="rgba(0, 0, 0, 0.1)"
                        />
                    </div>
                </Panel>
                <Background
                    variant={BackgroundVariant.Cross}
                    gap={12}
                    size={1}
                />
            </ReactFlow>
        </div>
    )
}

const items = [
    {
        title: "Object-Oriented Programming in Java",
        id: "OOP in Java",
        description: "Principles and techniques of OOP in Java",
        markdownContent:
            '### Method Overloading\nMethod overloading allows multiple methods in the same class to have the same name but different parameters (either in number, type, or both). This is useful for improving code readability and reusability.\n\n#### Example:\n```java\nclass MathUtils {\n    int add(int a, int b) { return a + b; }\n    double add(double a, double b) { return a + b; }\n    int add(int a, int b, int c) { return a + b + c; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        MathUtils math = new MathUtils();\n        System.out.println(math.add(2, 3)); // Calls int version\n        System.out.println(math.add(2.5, 3.5)); // Calls double version\n        System.out.println(math.add(1, 2, 3)); // Calls three-parameter version\n    }\n}\n```\n\n### Method Overriding\nMethod overriding allows a subclass to provide a specific implementation of a method defined in its superclass. This supports runtime polymorphism, ensuring the correct method is executed based on the object type.\n\n#### Example:\n```java\nclass Animal {\n    void makeSound() { System.out.println("Animal makes a sound"); }\n}\n\nclass Dog extends Animal {\n    @Override\n    void makeSound() { System.out.println("Dog barks"); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Animal myPet = new Dog(); // Upcasting\n        myPet.makeSound(); // Calls overridden method in Dog\n    }\n}\n```',
        subItems: [
            {
                title: "Classes & Objects",
                id: "Classes & Objects",
                description:
                    "The core of Object-Oriented Programming (OOP), representing real-world entities through classes and objects.",
                markdownContent:
                    '### Method Overloading\nMethod overloading allows multiple methods in the same class to have the same name but different parameters (either in number, type, or both). This is useful for improving code readability and reusability.\n\n#### Example:\n```java\nclass MathUtils {\n    int add(int a, int b) { return a + b; }\n    double add(double a, double b) { return a + b; }\n    int add(int a, int b, int c) { return a + b + c; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        MathUtils math = new MathUtils();\n        System.out.println(math.add(2, 3)); // Calls int version\n        System.out.println(math.add(2.5, 3.5)); // Calls double version\n        System.out.println(math.add(1, 2, 3)); // Calls three-parameter version\n    }\n}\n```\n\n### Method Overriding\nMethod overriding allows a subclass to provide a specific implementation of a method defined in its superclass. This supports runtime polymorphism, ensuring the correct method is executed based on the object type.\n\n#### Example:\n```java\nclass Animal {\n    void makeSound() { System.out.println("Animal makes a sound"); }\n}\n\nclass Dog extends Animal {\n    @Override\n    void makeSound() { System.out.println("Dog barks"); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Animal myPet = new Dog(); // Upcasting\n        myPet.makeSound(); // Calls overridden method in Dog\n    }\n}\n```',
                subItems: [
                    {
                        title: "Class Declaration",
                        id: "Class Declaration",
                        description:
                            "Defining a class in Java, including abstract classes and interfaces.",
                        markdownContent:
                            '### Abstract Classes\nAn abstract class cannot be instantiated and is meant to be extended by other classes. It can have both abstract methods (without implementation) and concrete methods.\n\n#### Example:\n```java\nabstract class Animal {\n    abstract void makeSound();\n    void sleep() { System.out.println("Sleeping..."); }\n}\n\nclass Cat extends Animal {\n    @Override\n    void makeSound() { System.out.println("Meow"); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Animal myCat = new Cat();\n        myCat.makeSound(); // Outputs: Meow\n        myCat.sleep(); // Outputs: Sleeping...\n    }\n}\n```\n\n### Interfaces\nAn interface defines a contract for classes to implement. Interfaces support multiple inheritance and ensure that classes follow a specific structure.\n\n#### Example:\n```java\ninterface Vehicle {\n    void drive();\n}\n\nclass Bike implements Vehicle {\n    @Override\n    public void drive() { System.out.println("Bike is driving"); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Vehicle myBike = new Bike();\n        myBike.drive(); // Outputs: Bike is driving\n    }\n}\n```',
                        subItems: [],
                    },
                    {
                        title: "Object Instantiation",
                        id: "Object Instantiation",
                        description:
                            "Creating an object from a class, including constructors and instantiation techniques.",
                        markdownContent:
                            '### Object Creation\nTo use a class in Java, you need to create an instance (object) using the \\`new\\` keyword.\n\n#### Example:\n\\`\\`\\`java\nclass Car {\n    String model;\n    int year;\n\n    // Constructor\n    Car(String model, int year) {\n        this.model = model;\n        this.year = year;\n    }\n\n    void displayInfo() {\n        System.out.println("Model: " + model + ", Year: " + year);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Car myCar = new Car("Tesla Model 3", 2023);\n        myCar.displayInfo(); // Outputs: Model: Tesla Model 3, Year: 2023\n    }\n}\n\\`\\`\\`\n\n### Default vs. Parameterized Constructors\n- **Default Constructor**: If no constructor is defined, Java provides a default one.\n- **Parameterized Constructor**: Allows passing arguments during object creation.\n\n### Anonymous Objects\nAn object without a reference variable, used when the object is required only once.\n\n#### Example:\n\\`\\`\\`java\nnew Car("Ford Mustang", 2022).displayInfo(); // Outputs: Model: Ford Mustang, Year: 2022\n\\`\\`\\`\n\n### Getter & Setter Methods\nEncapsulation is achieved by making fields private and providing public getter and setter methods:\n\n#### Example:\n\\`\\`\\`java\nclass Person {\n    private String name;\n    \n    public String getName() { return name; }\n    public void setName(String name) { this.name = name; }\n}\n\\`\\`\\`',
                        subItems: [],
                    },
                ],
            },
            {
                title: "Inheritance",
                id: "Inheritance",
                description: "Mechanism where one class inherits from another.",
                markdownContent: "",
                subItems: [
                    {
                        title: "extends keyword",
                        id: "extends keyword",
                        description: "Used to inherit a class in Java.",
                        markdownContent: "",
                        subItems: [],
                    },
                    {
                        title: "extends keyword",
                        id: "aeaze",
                        description: "Used to inherit a class in Java.",
                        markdownContent: "",
                        subItems: [],
                    },
                    {
                        title: "extends keyword",
                        id: "extenaeeazeeds keyword",
                        description: "Used to inherit a class in Java.",
                        markdownContent: "",
                        subItems: [],
                    },
                    {
                        title: "extends keyword",
                        id: "azeaeee",
                        description: "Used to inherit a class in Java.",
                        markdownContent: "",
                        subItems: [],
                    },
                ],
            },
            {
                title: "Polymorphism",
                id: "Polymorphism",
                description: "Ability of an object to take many forms.",
                markdownContent: "",
                subItems: [
                    {
                        title: "Method Overloading",
                        id: "Method Overloading",
                        description:
                            "Defining multiple methods with the same name but different parameters.",
                        markdownContent: "",
                        subItems: [],
                    },
                    {
                        title: "Method Overriding",
                        id: "Method Overriding",
                        description: "Redefining a method in a subclass.",
                        markdownContent: "",
                        subItems: [],
                    },
                ],
            },
            {
                title: "Encapsulation",
                id: "Encapsulation",
                description:
                    "Hiding internal state and requiring all interaction through an object's methods.",
                markdownContent: "",
                subItems: [
                    {
                        title: "Getter & Setter Methods",
                        id: "Getter & Setter Methods",
                        description:
                            "Methods to access and modify object properties.",
                        markdownContent: "",
                        subItems: [],
                    },
                ],
            },
            {
                title: "Abstraction",
                id: "Abstraction",
                description:
                    "Hiding complex implementation details while exposing only necessary features.",
                markdownContent: "",
                subItems: [
                    {
                        title: "Abstract Classes",
                        id: "Abstract Classes",
                        description:
                            "A class that cannot be instantiated, meant to be extended.",
                        markdownContent: "",
                        subItems: [],
                    },
                    {
                        title: "Interfaces",
                        id: "Interfaces",
                        description:
                            "Defines a contract for classes to implement.",
                        markdownContent: "",
                        subItems: [],
                    },
                ],
            },
        ],
    },
]

export type Item = {
    id: string
    title: string
    description: string
    markdownContent: string
    subItems: Item[]
}

const [initialNodes, initialEdges] = convertItemsToNodes(items, null)
