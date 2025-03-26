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
            "### Getter & Setter Methods\nEncapsulation is achieved by making fields private and providing public getter and setter methods:\n```java\nclass Person {\n    private String name;\n    \n    public String getName() { return name; }\n    public void setName(String name) { this.name = name; }\n}\n```",
        subItems: [
            {
                title: "Classes & Objects",
                id: "Classes & Objects",
                description:
                    "The core of OOP, representing real-world entities.",
                markdownContent:
                    '### Method Overloading\nMethod overloading allows multiple methods in the same class to have the same name but different parameters:\n```java\nclass MathUtils {\n    int add(int a, int b) { return a + b; }\n    double add(double a, double b) { return a + b; }\n}\n```\n\n### Method Overriding\nMethod overriding allows a subclass to provide a specific implementation of a method defined in its superclass:\n```java\nclass Animal {\n    void makeSound() { System.out.println("Animal makes a sound"); }\n}\n\nclass Dog extends Animal {\n    void makeSound() { System.out.println("Dog barks"); }\n}\n```',
                subItems: [
                    {
                        title: "Class Declaration",
                        id: "Class Declaration",
                        description: "Defining a class in Java.",
                        markdownContent:
                            '### Abstract Classes\nAn abstract class cannot be instantiated and is meant to be extended:\n```java\nabstract class Animal {\n    abstract void makeSound();\n}\n\nclass Cat extends Animal {\n    void makeSound() { System.out.println("Meow"); }\n}\n```\n\n### Interfaces\nAn interface defines a contract for classes to implement:\n```java\ninterface Vehicle {\n    void drive();\n}\n\nclass Bike implements Vehicle {\n    public void drive() { System.out.println("Bike is driving"); }\n}\n```',
                        subItems: [],
                    },
                    {
                        title: "Object Instantiation",
                        id: "Object Instantiation",
                        description: "Creating an object from a class.",
                        markdownContent: "",
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
