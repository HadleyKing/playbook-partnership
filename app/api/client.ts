/**
 * This file is autogenerated by cli/sync-api-import.ts
 *  and exports all API routes recursively in this directory.
 * It is designed to be imported client-side.
 */
import { APIInterface } from '@/spec/api'
import type { ChatDecoder as ChatDecoder_ } from './v1/chat'
export const ChatDecoder = APIInterface<typeof ChatDecoder_>("/api/v1/chat/decoder", "POST")
import type { ChatGPTEmbeddingCLF as ChatGPTEmbeddingCLF_ } from './v1/chat'
export const ChatGPTEmbeddingCLF = APIInterface<typeof ChatGPTEmbeddingCLF_>("/api/v1/chat/gpt-embedding-clf", "POST")
import type { ChatGPTPrompting as ChatGPTPrompting_ } from './v1/chat'
export const ChatGPTPrompting = APIInterface<typeof ChatGPTPrompting_>("/api/v1/chat/gpt-prompting", "POST")
import type { ChatGPTPrompting2 as ChatGPTPrompting2_ } from './v1/chat'
export const ChatGPTPrompting2 = APIInterface<typeof ChatGPTPrompting2_>("/api/v1/chat/gpt-prompting2", "POST")
import type { ChatTransformerEmbed as ChatTransformerEmbed_ } from './v1/chat'
export const ChatTransformerEmbed = APIInterface<typeof ChatTransformerEmbed_>("/api/v1/chat/transformer-embed", "POST")
import type { ChatTransformer as ChatTransformer_ } from './v1/chat'
export const ChatTransformer = APIInterface<typeof ChatTransformer_>("/api/v1/chat/transformer", "POST")
import type { UserIntegrationsCAVATICA as UserIntegrationsCAVATICA_ } from './v1/user/integrations/cavatica'
export const UserIntegrationsCAVATICA = APIInterface<typeof UserIntegrationsCAVATICA_>("/api/v1/user/integrations/cavatica", "GET")
import type { UserIntegrationsCAVATICAUpdate as UserIntegrationsCAVATICAUpdate_ } from './v1/user/integrations/cavatica'
export const UserIntegrationsCAVATICAUpdate = APIInterface<typeof UserIntegrationsCAVATICAUpdate_>("/api/v1/user/integrations/cavatica/update", "POST")
import type { UserIntegrationsCAVATICALaunch as UserIntegrationsCAVATICALaunch_ } from './v1/user/integrations/cavatica'
export const UserIntegrationsCAVATICALaunch = APIInterface<typeof UserIntegrationsCAVATICALaunch_>("/api/v1/user/integrations/cavatica/launch", "POST")
import type { UserIntegrationsCAVATICAStatus as UserIntegrationsCAVATICAStatus_ } from './v1/user/integrations/cavatica'
export const UserIntegrationsCAVATICAStatus = APIInterface<typeof UserIntegrationsCAVATICAStatus_>("/api/v1/user/integrations/cavatica/[session_id]/status", "GET")
import type { UserIntegrationsCAVATICADisconnect as UserIntegrationsCAVATICADisconnect_ } from './v1/user/integrations/cavatica'
export const UserIntegrationsCAVATICADisconnect = APIInterface<typeof UserIntegrationsCAVATICADisconnect_>("/api/v1/user/integrations/cavatica/[session_id]/disconnect", "POST")
import type { PublicPlaybooks as PublicPlaybooks_ } from './v1/user/playbooks'
export const PublicPlaybooks = APIInterface<typeof PublicPlaybooks_>("/api/v1/public/playbooks", "GET")
import type { PublicUserPlaybooks as PublicUserPlaybooks_ } from './v1/user/playbooks'
export const PublicUserPlaybooks = APIInterface<typeof PublicUserPlaybooks_>("/api/v1/public/user/playbooks", "GET")
import type { UserPlaybooks as UserPlaybooks_ } from './v1/user/playbooks'
export const UserPlaybooks = APIInterface<typeof UserPlaybooks_>("/api/v1/user/playbooks", "GET")
import type { UserPlaybook as UserPlaybook_ } from './v1/user/playbooks'
export const UserPlaybook = APIInterface<typeof UserPlaybook_>("/api/v1/user/playbooks/[id]", "GET")
import type { UpdateUserPlaybook as UpdateUserPlaybook_ } from './v1/user/playbooks'
export const UpdateUserPlaybook = APIInterface<typeof UpdateUserPlaybook_>("/api/v1/user/playbooks/[id]/update", "POST")
import type { PublishUserPlaybook as PublishUserPlaybook_ } from './v1/user/playbooks'
export const PublishUserPlaybook = APIInterface<typeof PublishUserPlaybook_>("/api/v1/user/playbooks/[id]/publish", "POST")
import type { DeleteUserPlaybook as DeleteUserPlaybook_ } from './v1/user/playbooks'
export const DeleteUserPlaybook = APIInterface<typeof DeleteUserPlaybook_>("/api/v1/user/playbooks/[id]/delete", "POST")