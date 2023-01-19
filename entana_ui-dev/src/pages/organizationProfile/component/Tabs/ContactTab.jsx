import { CardWithTitle } from "./component/CustomCard";
import { useImmer } from "use-immer";
import { gql, useMutation } from '@apollo/client';
import { useContext, useEffect, useState } from "react";
import { ProfileContext } from "pages/organizationProfile";
import openNotification from "utils/Notification";

const AlertContent = [
    "Please Input your Name...",
    "Please Input Your Company Name...",
    "Please Input Your Email Address",
    "Please Input Your Phone Number...",
    ""
]

const AlertCondition = [
    (fullName) => fullName.trim() === '',
    (companyName) => companyName.trim() === '',
    (email) => !!!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim()),
    (phone) => !!!/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(phone.trim()),
    (enquiry) => !!!enquiry.trim()
]

const Input = (props) => {
    const { label, name, value, setData, passIdx } = props;

    function onChange(e) {
        setData(draft => {
            draft[e.target.name] = e.target.value
        })
    }


    return (
        <div>

            <div className={"flex content-center justify-between max-w-3xl m-auto w-full"}>
                <label htmlFor={name} >{label}</label>
                <input
                    className={"flex-auto max-w-xl border-none rounded h-10 px-2"}
                    type={name != "email" ? "text" : name != "phoneNumber" ? "email" : "number"} name={name} id={name}

                    onChange={onChange} value={value || ""}
                />
            </div >
            <div className={'max-w-3xl m-auto w-full  text-red-500'}>
                {value != undefined && AlertCondition[passIdx](value) && AlertContent[passIdx]}
            </div>
        </div>
    )
}

const formDefault = {
    fullName: undefined,
    companyName: undefined,
    email: undefined,
    phoneNumber: undefined,
    enquiry: undefined
}

const labels = [
    "Full Name",
    "Company Name",
    "Email Address",
    "Phone Number",
    "Enquiry"
]

export const CREATE_CONTACT = gql`
  mutation createContact ($data: ContactInput!) {
    createContact(data: $data) {
        companyName
    }
  }
`;

export function useCreateContact() {
    const [createContact, { data }] = useMutation(CREATE_CONTACT);
    return [createContact, { data }];
}

const useAllowSubmit = (data) => {
    const [allowSubmit, setAllow] = useState(false)

    useEffect(() => {
        const inputList = Object.entries(data).map(([name, value], idx) => {
            return value && !!!AlertCondition[idx](value)
        })

        if (inputList.every(element => element)) {
            setAllow(true)
        } else {
            setAllow(false)
        }
    }, [data])

    return [allowSubmit, setAllow]
}


export default function ContactTab() {
    const { id } = useContext(ProfileContext)
    const [data, setData] = useImmer(formDefault)
    const [post, { data: resultPost }] = useCreateContact()
    const [allowSubmit, setAllow] = useAllowSubmit(data)

    const inputList = Object.entries(data).map(([name, value], idx) => {
        return {
            name,
            label: labels[idx],
            value: value,
        }
    })


    function onSubmit(e) {
        e.preventDefault()

        if (!allowSubmit) { return }

        post({
            variables: {
                data: {
                    orgId: id,
                    ...data
                }
            }
        })


        setAllow(false)
    }

    useEffect(() => {
        if (resultPost) {
            openNotification("success", `Thank you! We will contact  ${JSON.stringify(resultPost.createContact.companyName)} later.`)
        }
    }, [resultPost])

    function onClear() {

        setData(draft => {
            return formDefault
        })
    }

    const btnClass = "px-8 py-3 uppercase border-none bg-sky-500 hover:bg-sky-400 text-white cursor-pointer rounded-md tracking-wider "

    const disabledClass = "px-8 py-3 uppercase border-none bg-sky-200 text-white cursor-not-allowed rounded-md tracking-wider"

    return (
        <CardWithTitle title="Contact">
            <form className={"bg-slate-200 p-10 rounded-lg flex flex-col gap-5"} onSubmit={onSubmit}>
                {inputList.map((props, idx) => <Input  {...props} passIdx={idx} key={idx} setData={setData} />)}
                <div className="m-auto w-full max-w-3xl flex gap-5">
                    <div onClick={onClear} className={`ml-auto ${btnClass}`}>Clear</div>
                    <input type="submit" className={`${allowSubmit ? btnClass : disabledClass}`} disabled={!allowSubmit} value="Submit" />
                </div>
            </form>
        </CardWithTitle>
    )
}